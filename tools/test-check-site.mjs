// Regression test for what check-site counts. Runs anywhere, needs no build, ~0.1s.
//
// The bug this guards against: `pages` was once a raw `.html` count, which reads 693 on
// Windows and 1269 on Linux for the same site, because Quartz emits an original-case redirect
// stub per note and NTFS collapses each pair. A baseline taken on either machine then looked
// like a 45% regression on the other. See site trap T9 / vault backlog F59.
//
// This test cannot run on the real output directory, because a Windows filesystem physically
// cannot hold both halves of a case-variant pair. So it asserts against a FIXTURE that
// reproduces what CI actually emits.

import { countPages, METRIC_UNITS } from "./lib/page-count.mjs"

let failed = 0
let ran = 0
const check = (name, actual, expected) => {
  ran++
  const ok = actual === expected
  if (!ok) {
    failed++
    console.error(`  FAIL  ${name}\n          expected ${expected}, got ${actual}`)
  } else {
    console.log(`  ok    ${name}`)
  }
}

console.log("test-check-site: what counts as a page")

// 1. The Linux shape: every real page has a mixed-case redirect stub beside it.
const real = [
  "index.html",
  "404.html",
  "tags/begrepp.html",
  "kth/2026-höst/hi1031-distribuerade-informationssystem/index.html",
  "kth/2026-höst/hi1031-distribuerade-informationssystem/begrepp/replikering.html",
  "kth/2024-vår/cm1005-extern-redovisning/begrepp/förbrukningsinventarier.html",
]
const stubs = [
  "KTH/2026-Höst/HI1031-Distribuerade-informationssystem/index.html",
  "KTH/2026-Höst/HI1031-Distribuerade-informationssystem/Begrepp/Replikering.html",
  "KTH/2024-Vår/CM1005-Extern-Redovisning/Begrepp/Förbrukningsinventarier.html",
]

const linux = countPages([...real, ...stubs])
check("linux: raw file count includes the stubs", linux.rawHtmlFiles, 9)
check("linux: pages ignores the stubs", linux.pages, 6)
check("linux: stubs are reported, not silently dropped", linux.redirectStubs, 3)

// 2. The Windows shape: the same build, pairs already collapsed by the filesystem.
const windows = countPages(real)
check("windows: raw file count", windows.rawHtmlFiles, 6)
check("windows: pages", windows.pages, 6)
check("windows: no stubs survive", windows.redirectStubs, 0)

// 3. THE INVARIANT THAT MATTERS: both platforms must agree on `pages`.
check("linux and windows agree on pages", linux.pages, windows.pages)

// 4. Swedish characters must not be mangled into a false collapse. "Höst" and "höst" are the
//    same route; "Vår" and "Var" are NOT.
const swedish = countPages(["kth/2026-höst/a.html", "KTH/2026-Höst/A.html"])
check("case-variant Swedish paths collapse to one route", swedish.pages, 1)
const distinctSwedish = countPages(["kth/2024-vår/a.html", "kth/2024-var/a.html"])
check("genuinely different Swedish paths stay separate", distinctSwedish.pages, 2)

// 5. Real proportions from a CI run, so a scaling mistake shows up.
const ciShape = countPages([
  ...Array.from({ length: 693 }, (_, i) => `page${i}.html`),
  ...Array.from({ length: 576 }, (_, i) => `PAGE${i}.html`),
])
check("CI proportions: 1269 raw files", ciShape.rawHtmlFiles, 1269)
check("CI proportions: 693 pages", ciShape.pages, 693)
check("CI proportions: 576 stubs", ciShape.redirectStubs, 576)

// 6. Every metric the baseline compares must declare what it counts, so no future metric can
//    be added and baselined without anyone knowing whether it is machine-independent.
const baselined = [
  "pages",
  "pagesWithCallouts",
  "questionCallouts",
  "images",
  "imagesWithoutAlt",
  "katexErrorPages",
  "cardLeakPages",
  "internalLinks",
  "brokenInternalLinks",
]
for (const key of baselined) {
  check(`METRIC_UNITS declares '${key}'`, typeof METRIC_UNITS[key], "string")
}

// 7. Degenerate input must not throw.
check("empty input", countPages([]).pages, 0)

console.log(`\n${ran} assertions, ${failed} failed`)
if (failed > 0) {
  console.error("\ntest-check-site FAILED - do not change what `pages` counts without reading")
  console.error("tools/lib/page-count.mjs and site trap T9 first.")
  process.exit(1)
}
process.exit(0)
