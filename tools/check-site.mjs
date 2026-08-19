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

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs"
import { join, dirname, posix } from "node:path"

const args = process.argv.slice(2)
const update = args.includes("--update")
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
  pages: files.length,
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
for (const [k, v] of Object.entries(m)) console.log(`  ${k.padEnd(22)} ${v}`)

// Broken links are worth seeing even when the run passes, so they do not quietly
// accumulate up to whatever the baseline happens to allow.
if (m.brokenInternalLinks > 0) {
  console.log(`\nbroken internal links (${m.brokenInternalLinks}, showing ${detail.broken.length}):`)
  for (const s of detail.broken) console.log(`    ${s}`)
}

if (update) {
  writeFileSync(baselineFile, `${JSON.stringify(m, null, 2)}\n`)
  console.log(`\nbaseline written to ${baselineFile}`)
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
  process.exit(1)
}

console.log("\ncheck-site OK")
