// What counts as a "page", in one place so a test cannot drift from the implementation.
//
// This exists because getting it wrong cost a day. Quartz emits a 448-byte redirect stub at
// each note's ORIGINAL-CASED path (`KTH/2026-Höst/.../Replikering.html` - meta-refresh,
// rel=canonical, robots:noindex) pointing at the lowercase slug it actually serves.
//
//   Linux  keeps both files                    -> 1269 .html for this vault
//   NTFS   is case-insensitive, pairs collapse ->  693 .html for the same build
//
// A raw `.html` count therefore differs by 45% between CI and a Windows machine, and both
// numbers are honest. Counting DISTINCT CASE-INSENSITIVE routes gives 693 on both, which is
// what makes a locally-taken baseline valid and keeps the local build usable as a gate.
//
// Verified against a real CI artifact listing: 1269 raw paths -> 693 distinct, 576 stubs,
// zero stubs without a lowercase twin. See site trap T9 and vault backlog F59.

/**
 * @param {string[]} htmlFiles paths relative to the output dir, forward-slashed
 * @returns {{pages: number, redirectStubs: number, rawHtmlFiles: number}}
 */
export function countPages(htmlFiles) {
  const distinct = new Set(htmlFiles.map((f) => f.toLowerCase()))
  return {
    pages: distinct.size,
    redirectStubs: htmlFiles.length - distinct.size,
    rawHtmlFiles: htmlFiles.length,
  }
}

// What each baselined metric COUNTS. Published in build-report.json next to the values,
// because this whole incident was two correct measurements disagreeing about the unit.
// A metric without an entry here is a metric nobody can safely compare across machines.
export const METRIC_UNITS = {
  pages: "distinct case-insensitive HTML routes (NOT raw .html files)",
  pagesWithCallouts: "HTML routes containing at least one rendered callout",
  questionCallouts: "rendered flashcard question callouts, summed over all routes",
  images: "<img> elements, summed over all routes",
  imagesWithoutAlt: "<img> elements with no non-empty alt attribute",
  katexErrorPages: "routes containing a KaTeX error marker",
  cardLeakPages: "routes showing raw flashcard separator syntax in visible text",
  internalLinks: "site-internal <a href> targets, summed over all routes",
  brokenInternalLinks: "internal <a href> targets that resolve to no emitted route",
}
