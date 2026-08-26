#!/usr/bin/env node
// Verify the BUILT site, not the source. Run after `quartz build`.
//
// Two kinds of check:
//
//   1. Invariants that must always be zero - raw flashcard syntax leaking into visible
//      text, KaTeX errors, images without alt text.
//   2. A comparison against site-baseline.json. Counts may GROW freely (you add notes),
//      but a DROP means content silently stopped rendering. That asymmetry is the point:
//      it catches regressions nobody thought to write a check for. The flashcard
//      transformer once missed 34 notes and ~1280 cards, which no named check would have
//      found, but a callout count falling off a cliff would have.
//
// Usage:
//   node tools/check-site.mjs [dir]            check (default dir: public)
//   node tools/check-site.mjs [dir] --update   accept current numbers as the new baseline
//
// No dependencies, single pass, ~2 s over 600 pages.

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs"
import { join, dirname, posix } from "node:path"

const args = process.argv.slice(2)
const update = args.includes("--update")
const force = args.includes("--force")
const dir = args.find((a) => !a.startsWith("--")) ?? "public"
const baselineFile = "site-baseline.json"

// Counts may fall by this fraction before it is treated as content disappearing.
// Deleting a note or two is normal; losing 5% of the site is not.
const DROP_TOLERANCE = 0.05

if (!existsSync(dir)) {
  console.error(`check-site: '${dir}' does not exist. Run 'npx quartz build' first.`)
  process.exit(1)
}

// ---------- collect pages ----------
const allEmitted = readdirSync(dir, { recursive: true, encoding: "utf8" }).map((f) =>
  f.split("\\").join("/"),
)
const files = allEmitted.filter((f) => f.endsWith(".html"))

if (files.length === 0) {
  console.error(`check-site: no HTML found under '${dir}'.`)
  process.exit(1)
}

// A single Quartz build writes every page within a few seconds. Pages much OLDER than the
// rest mean this directory holds output from MORE THAN ONE build - stale pages from an
// earlier run that the current one did not overwrite. Counting those inflates every metric,
// so a baseline taken from such a directory silently poisons the gate. This guard is
// precautionary: it has not yet caused a real failure here, but nothing else would notice,
// and the baseline is the one number the deploy depends on.
//
// Measured against the MEDIAN, and requiring a MINORITY SHARE to be old. A plain
// max-minus-min span gave a false warning on a perfectly clean build, because deploy.yml
// runs slim-svg.mjs between the build and this check: it rewrites ~17 Excalidraw pages and
// so pushes the newest mtime minutes past the oldest. Only files that are old relative to
// the bulk are evidence of a second build.
const mtimes = files.map((f) => statSync(join(dir, f)).mtimeMs)
const sortedMtimes = [...mtimes].sort((a, b) => a - b)
const medianMtime = sortedMtimes[Math.floor(sortedMtimes.length / 2)]
const STALE_SPAN_SECONDS = 300
const STALE_SHARE = 0.05
const staleFiles = mtimes.filter((t) => (medianMtime - t) / 1000 > STALE_SPAN_SECONDS).length
const spanSeconds = Math.round((Math.max(...mtimes) - Math.min(...mtimes)) / 1000)
const looksStale = staleFiles > files.length * STALE_SHARE

if (looksStale) {
  console.error(
    `\ncheck-site: WARNING - ${staleFiles} of ${files.length} HTML files are more than ` +
      `${STALE_SPAN_SECONDS}s older than the rest of this directory.`,
  )
  console.error("  That usually means the directory holds output from more than one build.")
  console.error("  Delete it and rebuild before trusting these numbers:")
  console.error(`    rm -r ${dir} && npx quartz build -o ${dir}`)
}

// Distinct pages, counted case-insensitively - NOT the raw number of .html files.
//
// Quartz emits a 448-byte redirect stub at each note's ORIGINAL-cased path
// (`KTH/2026-Höst/.../Replikering.html`, meta-refresh + rel=canonical + robots:noindex)
// pointing at the lowercase slug it serves from. On Linux both files exist. On a
// case-insensitive filesystem (Windows, usually macOS) each pair collapses into a single
// file, so a raw count reads 693 here against CI's 1269 - a 45% gap that silently disabled
// the drop check for this metric and made the local build useless as a gate.
//
// Verified against a real CI artifact listing: 1269 raw paths, of which 576 are mixed-case
// stubs, every one with a lowercase twin, leaving exactly 693 - the local figure. Counting
// distinct lowercase routes makes this reproducible on either platform, so a baseline taken
// locally is valid. Every other metric was already identical between the two builds.
const distinctRoutes = new Set(files.map((f) => f.toLowerCase())).size
const redirectStubs = files.length - distinctRoutes

// Every route the site actually serves. This must include non-HTML assets (images, feeds)
// or every link to one is reported as broken. Note that PDFs are deliberately not
// published, so links into them are genuinely dead on the public site - that is a real
// finding, not a gap here.
const routes = new Set()
for (const f of allEmitted) routes.add(f)
for (const f of files) {
  const noExt = f.slice(0, -".html".length)
  routes.add(noExt)
  if (noExt.endsWith("/index")) routes.add(noExt.slice(0, -"/index".length))
  if (noExt === "index") routes.add("")
}

const m = {
  pages: distinctRoutes,
  pagesWithCallouts: 0,
  questionCallouts: 0,
  images: 0,
  imagesWithoutAlt: 0,
  katexErrorPages: 0,
  cardLeakPages: 0,
  internalLinks: 0,
  brokenInternalLinks: 0,
}
const detail = { cardLeaks: [], missingAlt: [], katex: [], broken: [] }

const norm = (p) => {
  const out = []
  for (const seg of p.split("/")) {
    if (seg === "" || seg === ".") continue
    if (seg === "..") out.pop()
    else out.push(seg)
  }
  return out.join("/")
}

const decode = (s) => {
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

for (const rel of files) {
  const html = readFileSync(join(dir, rel), "utf8")

  // Visible text only. Inline JS contains '||' and the vault's own docs quote card
  // syntax; scanning raw HTML reported 34 false leaks once, including the 404 page's
  // own script.
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<pre[\s\S]*?<\/pre>/g, "")
    .replace(/<code[\s\S]*?<\/code>/g, "")

  if (
    /\(Definition\)::/.test(visible) ||
    /^\s*\?\?\s*$/m.test(visible) ||
    /DISABLEDFLASHCARD/.test(visible)
  ) {
    m.cardLeakPages++
    if (detail.cardLeaks.length < 10) detail.cardLeaks.push(rel)
  }

  const callouts = (html.match(/data-callout="question"/g) ?? []).length
  if (callouts > 0) {
    m.pagesWithCallouts++
    m.questionCallouts += callouts
  }

  if (html.includes("katex-error")) {
    m.katexErrorPages++
    if (detail.katex.length < 10) detail.katex.push(rel)
  }

  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    m.images++
    if (!/\balt\s*=\s*"[^"]+"/.test(tag)) {
      m.imagesWithoutAlt++
      if (detail.missingAlt.length < 10) detail.missingAlt.push(`${rel} :: ${tag.slice(0, 90)}`)
    }
  }

  // Internal links: resolve each against the routes the build actually emitted.
  const pageDir = dirname(rel) === "." ? "" : dirname(rel)
  for (const tag of html.match(/<a\b[^>]*>/g) ?? []) {
    if (!/class="[^"]*\binternal\b/.test(tag)) continue
    const href = tag.match(/href="([^"]*)"/)?.[1]
    if (!href) continue
    if (/^(https?:|mailto:|#|\/\/)/.test(href)) continue
    m.internalLinks++
    let target = decode(href.split("#")[0].split("?")[0])
    if (target === "") continue
    if (target.endsWith("/")) target = target.slice(0, -1)
    const resolved = norm(target.startsWith("/") ? target : posix.join(pageDir, target))
    if (!routes.has(resolved) && !routes.has(`${resolved}/index`)) {
      m.brokenInternalLinks++
      if (detail.broken.length < 15) detail.broken.push(`${rel}  ->  ${href}`)
    }
  }
}

// ---------- report ----------
console.log(`check-site: ${dir}`)
if (redirectStubs > 0) {
  console.log(
    `  (${files.length} html files, ${redirectStubs} of them original-case redirect stubs)`,
  )
}
for (const [k, v] of Object.entries(m)) console.log(`  ${k.padEnd(22)} ${v}`)

// Broken links are worth seeing even when the run passes, so they do not quietly
// accumulate up to whatever the baseline happens to allow.
if (m.brokenInternalLinks > 0) {
  console.log(`\nbroken internal links (${m.brokenInternalLinks}, showing ${detail.broken.length}):`)
  for (const s of detail.broken) console.log(`    ${s}`)
}

if (update) {
  // Refuse to record a baseline from a directory that looks like two builds stacked on top
  // of each other. This is the exact mistake that broke the gate once already.
  if (looksStale && !force) {
    console.error(
      "\ncheck-site: REFUSING to write a baseline from a directory that looks stale.",
    )
    console.error("  Rebuild into an empty directory, or pass --force if you are certain.")
    process.exit(1)
  }
  const meta = {
    generatedAt: new Date().toISOString(),
    sourceDir: dir,
    htmlFiles: files.length,
    redirectStubs,
    writeSpanSeconds: spanSeconds,
    forced: Boolean(force),
  }
  writeFileSync(baselineFile, `${JSON.stringify({ ...m, _meta: meta }, null, 2)}\n`)
  console.log(`\nbaseline written to ${baselineFile}`)
  console.log(`  from ${dir} - ${files.length} pages written over ${spanSeconds}s`)
  process.exit(0)
}

const problems = []

// 1. Absolute invariants.
const zeroInvariants = [
  ["cardLeakPages", "pages showing raw flashcard syntax", detail.cardLeaks],
  ["imagesWithoutAlt", "images with no alt text", detail.missingAlt],
  ["katexErrorPages", "pages with KaTeX errors", detail.katex],
]
for (const [key, label, samples] of zeroInvariants) {
  if (m[key] > 0) {
    problems.push(`${m[key]} ${label}`)
    for (const s of samples) console.error(`    ${s}`)
  }
}

// 2. Baseline comparison.
if (!existsSync(baselineFile)) {
  console.log(`\nNo ${baselineFile} yet. Create it with:  node tools/check-site.mjs ${dir} --update`)
} else {
  const base = JSON.parse(readFileSync(baselineFile, "utf8"))
  console.log("\nvs baseline:")
  for (const [k, v] of Object.entries(m)) {
    const b = base[k]
    if (typeof b !== "number") continue
    const delta = v - b
    const flag = delta === 0 ? "" : delta > 0 ? `  +${delta}` : `  ${delta}`
    console.log(`  ${k.padEnd(22)} ${String(v).padEnd(7)} baseline ${String(b).padEnd(7)}${flag}`)

    // Growth is normal. Shrinkage means something stopped rendering.
    if (b > 0 && v < b * (1 - DROP_TOLERANCE)) {
      problems.push(`${k} fell from ${b} to ${v} (more than ${DROP_TOLERANCE * 100}%) - content stopped rendering?`)
    }
  }
  // Broken links must never increase.
  if (m.brokenInternalLinks > base.brokenInternalLinks) {
    problems.push(`brokenInternalLinks rose from ${base.brokenInternalLinks} to ${m.brokenInternalLinks}`)
    for (const s of detail.broken) console.error(`    ${s}`)
  }
}

if (problems.length > 0) {
  console.error("\ncheck-site FAILED:")
  for (const p of problems) console.error(`  - ${p}`)
  console.error("\nIf a change is intentional, re-baseline with:")
  console.error(`  node tools/check-site.mjs ${dir} --update`)
  printNotChecked()
  process.exit(1)
}

console.log("\ncheck-site OK")
printNotChecked()

// A pass means "nothing was found by the checks that ran" - never "the site is good".
// Printing the blind spots every run stops a green result being over-read. This exists
// because a "0 pages leak flashcard syntax" claim was true for weeks while 34 pages leaked:
// the check only inspected pages containing id="flashcards", and never said so.
function printNotChecked() {
  console.log(`
NOT CHECKED by this script - a pass means only that the checks above found nothing:
  - Visual layout, spacing, or whether anything looks broken.
  - Mobile rendering. Nothing here opens a browser or a phone.
  - Whether search finds Swedish terms containing a-ring or umlauts, or course codes.
  - KaTeX legibility. It counts render *errors*, not whether a formula is readable
    against the dark-only theme.
  - Excalidraw readability. It never asks whether a drawing is legible at phone width,
    only that the page emitted.
  - Whether a link's target page contains what the link text promises.
  - Content accuracy. Nothing here reads the Swedish prose.
  - Page weight and load time on mobile data.

  Those need a person. See MANUAL-CHECK.md - Priority 1 takes about ten minutes.`)
}
