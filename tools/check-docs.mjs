#!/usr/bin/env node
// check-docs.mjs - audit this repo's DOCUMENTATION against its machine-readable facts.
//
//   node tools/check-docs.mjs            report, exit 1 on any finding
//   node tools/check-docs.mjs --list     also list every figure mention it inspected
//
// WHY THIS EXISTS
//   check-site.mjs audits the built OUTPUT. Nothing audited the repo's own prose, and prose
//   is where this project actually drifts. On 2026-08-28 a hand audit found PROJECT-NOTES.md
//   presenting brokenInternalLinks "43 -> 85" as current while the sentence above it said 44.
//   It fixed PROJECT-NOTES.md and missed the identical stale 85 in .kiro/traps.md, where it
//   survived another eight days. Re-reading six documents for numeric consistency is exactly
//   the job to hand to a script.
//
// WHAT IT CHECKS
//   1. STALE FIGURE - a line naming a baselined metric BY ITS IDENTIFIER and putting a
//      different integer next to it, with nothing marking that integer as history.
//   2. MISSING REFERENCE - a doc cites a path in backticks that exists neither relative to
//      the repo root nor relative to the citing document.
//   3. UNDECLARED METRIC - a metric in site-baseline.json with no METRIC_UNITS entry.
//
// THE PREDICATE, AND WHY IT IS NARROW ON PURPOSE
//   Only metric identifiers containing an uppercase letter are matched - brokenInternalLinks,
//   questionCallouts, katexErrorPages and so on. The bare names `pages` and `images` are
//   ordinary English words: the first draft of this script matched them as substrings and
//   produced 20 findings, 19 of them nonsense ("397 pages render callouts", "34 pages leaked
//   syntax", "in 2s ... 600 pages"). A check that cries wolf gets ignored, which is worse than
//   no check, so it now inspects less and can be trusted.
//
//   The cost is a real blind spot, stated rather than hidden: a sentence that gives a figure
//   WITHOUT naming the metric is invisible here. MANUAL-CHECK.md's "There are 85 of these"
//   about dead PDF links is exactly that case and this script cannot see it. When you quote a
//   baselined number in prose, name the metric next to it so this check can reach it.
//
// WHAT IT DELIBERATELY DOES NOT DO
//   It does not build, render or judge the site, and it has no opinion on whether 650 pages
//   beats 648. A pass means "the docs agree with the machine-readable facts", never "the docs
//   are correct". Wording, layout and rendering still need MANUAL-CHECK.md.
//
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { join, dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { METRIC_UNITS } from "./lib/page-count.mjs"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const listAll = process.argv.includes("--list")

// Docs this repo owns. Upstream Quartz docs (docs/), the vault (content/) and build output
// (public/) are out of scope - not ours to keep consistent.
const DOC_ROOTS = ["PROJECT-NOTES.md", "MANUAL-CHECK.md", "README.md", ".kiro"]

// An integer on a line containing one of these is being presented as history, not as the
// current value. Keep this list short and boring; a long one turns the check off.
const HISTORY_MARKERS = [
  "->",
  "\u2192",
  "fell",
  "dropped",
  "was ",
  "peak",
  "history",
  "historical",
  "used to",
  "previously",
  "before ",
  "no longer",
  "once ",
  "would have",
  "CI proportions",
  "for weeks",
]

function walk(rel, out = []) {
  const abs = join(repoRoot, rel)
  if (!existsSync(abs)) return out
  if (statSync(abs).isFile()) {
    if (abs.endsWith(".md")) out.push(rel.split("\\").join("/"))
    return out
  }
  for (const e of readdirSync(abs)) walk(join(rel, e), out)
  return out
}
const docs = DOC_ROOTS.flatMap((d) => walk(d))

const baselinePath = join(repoRoot, "site-baseline.json")
if (!existsSync(baselinePath)) {
  console.error("check-docs: site-baseline.json not found - nothing to compare against.")
  process.exit(1)
}
const baseline = JSON.parse(readFileSync(baselinePath, "utf8"))
const allMetrics = Object.fromEntries(
  Object.entries(baseline).filter(([k, v]) => k !== "_meta" && Number.isInteger(v)),
)
// Only identifiers that cannot be confused with prose.
const checkable = Object.fromEntries(Object.entries(allMetrics).filter(([k]) => /[A-Z]/.test(k)))
const unmatchable = Object.keys(allMetrics).filter((k) => !/[A-Z]/.test(k))

const findings = []
const inspected = []

for (const name of Object.keys(allMetrics)) {
  if (!(name in METRIC_UNITS)) {
    findings.push({
      kind: "UNDECLARED METRIC",
      where: "site-baseline.json",
      detail: `${name} has no METRIC_UNITS entry in tools/lib/page-count.mjs, so nothing records what it counts`,
    })
  }
}

// Comma-grouped numbers ("2,233") must read as one integer, not two.
const ungroup = (s) => s.replace(/(\d),(?=\d{3}\b)/g, "$1")

for (const rel of docs) {
  const lines = readFileSync(join(repoRoot, rel), "utf8").split(/\r?\n/)
  lines.forEach((raw, i) => {
    const lineNo = i + 1
    const line = ungroup(raw)

    for (const [name, value] of Object.entries(checkable)) {
      if (!new RegExp(`\\b${name}\\b`).test(line)) continue
      const ints = (line.match(/\b\d{1,7}\b/g) ?? []).map(Number)
      if (ints.length === 0) continue
      const hasHistory = HISTORY_MARKERS.some((m) => line.includes(m))
      const agrees = ints.includes(value)
      inspected.push({ rel, lineNo, name, value, ints, hasHistory, agrees })
      if (!agrees && !hasHistory) {
        findings.push({
          kind: "STALE FIGURE",
          where: `${rel}:${lineNo}`,
          detail: `names ${name} alongside ${ints.join(", ")}, but site-baseline.json says ${value}. If that integer is history, mark it on the same line (e.g. "fell ${ints[0]} -> ${value}").`,
        })
      }
    }

    for (const m of raw.match(/`([^`\n]+)`/g) ?? []) {
      const cand = m.slice(1, -1).trim()
      if (!/^[\w.@][\w./@-]*\.(mjs|ts|tsx|js|json|yaml|yml|md|sh)$/.test(cand)) continue
      if (!cand.includes("/")) continue // a bare filename may legitimately live elsewhere
      if (cand.startsWith("http")) continue
      if (cand.startsWith("content/")) continue // the vault submodule, may be uninitialised
      // Resolve against the repo root AND the citing document's own directory: .kiro/README.md
      // correctly writes `steering/product.md`, meaning .kiro/steering/product.md. Also resolve
      // through content/, because these docs legitimately cite VAULT paths such as
      // `Atlas/Dashboard.md` - the vault is mounted there as a submodule.
      if (existsSync(join(repoRoot, cand))) continue
      if (existsSync(join(repoRoot, dirname(rel), cand))) continue
      if (existsSync(join(repoRoot, "content", cand))) continue
      findings.push({
        kind: "MISSING REFERENCE",
        where: `${rel}:${lineNo}`,
        detail: `cites \`${cand}\`, which exists neither at the repo root, beside this document, nor in the vault under content/`,
      })
    }
  })
}

console.log(`check-docs: ${docs.length} documents, ${Object.keys(allMetrics).length} baselined metrics`)
console.log(`  baseline generated ${baseline._meta?.generatedAt ?? "(unknown)"}`)
console.log(`  checkable identifiers: ${Object.keys(checkable).length}`)
console.log(`  NOT checkable (ordinary English words, invisible to this check): ${unmatchable.join(", ")}`)
const agreeing = inspected.filter((f) => f.agrees).length
const historical = inspected.filter((f) => !f.agrees && f.hasHistory).length
console.log(`  figure mentions inspected: ${inspected.length} (${agreeing} agree, ${historical} marked history)`)
console.log("")

if (listAll) {
  for (const f of inspected) {
    const verdict = f.agrees ? "ok      " : f.hasHistory ? "history " : "STALE   "
    console.log(`  ${verdict} ${f.rel}:${f.lineNo}  ${f.name} -> [${f.ints.join(", ")}] baseline ${f.value}`)
  }
  console.log("")
}

if (findings.length === 0) {
  console.log("check-docs: clean - every documented figure that names its metric agrees with")
  console.log("            site-baseline.json, every cited path resolves, every metric has a unit.")
  console.log("")
  console.log("This proves consistency, not truth. Rendering, layout, Swedish search and whether")
  console.log("a formula is legible are in MANUAL-CHECK.md and need a person.")
  process.exit(0)
}

const byKind = {}
for (const f of findings) (byKind[f.kind] ??= []).push(f)
for (const [kind, list] of Object.entries(byKind)) {
  console.log(`${kind} (${list.length})`)
  for (const f of list) console.log(`  ${f.where}\n      ${f.detail}`)
  console.log("")
}
console.log(`check-docs: ${findings.length} finding(s).`)
process.exit(1)
