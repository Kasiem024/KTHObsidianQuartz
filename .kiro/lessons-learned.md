---
inclusion: auto
description: The feedback loop for the site. When a build passed and the output was still wrong, it gets recorded here and the miss becomes a new check. Read when a check turns out to have been insufficient.
---

# Lessons learned

For the cases where the build was green and the site was still wrong. Ordinary defects belong in
`PROJECT-NOTES.md` or the vault's backlog; this file is for **misses** — and each entry should end
with a rule or a check that now prevents it.

Format: what happened / why the checks missed it / rule added / lesson.

---

## 2026-08-19 — a green build says nothing about the output

**What happened:** for weeks the site published raw `::` flashcard syntax on 34 pages, and 183
images with no `alt` text. Every build exited 0 the whole time.

**Why the checks missed it:** there were no output checks at all. `quartz build` reports whether
it *ran*, not whether what it produced is correct, and the deploy uploaded whatever appeared.

**Rule added:** `tools/check-site.mjs` runs in `deploy.yml` between the slim step and the upload,
so a bad artifact cannot ship. It enforces zero-tolerance invariants and compares everything else
against `site-baseline.json`.

**Lesson:** a build's exit code describes the build, not the site.

## 2026-08-19 — named checks cannot catch unnamed defects

**What happened:** the flashcard transformer silently skipped 34 notes and roughly 1,280 cards.
No check existed for it, because nobody had thought of that failure mode.

**Why the checks missed it:** every check was a named assertion about a known defect. A defect
nobody had imagined had nothing watching for it.

**Rule added:** the baseline comparison in `check-site.mjs` is **asymmetric** — counts may grow
freely, but a drop of more than 5% fails. It therefore catches *any* regression that makes
content stop rendering, including ones nobody enumerated.

**Lesson:** pair named assertions with one shape-of-the-whole measurement, so unknown regressions
still have something to trip over.

## 2026-08-19 — the thing you are measuring may not be the thing you changed

**What happened:** after fixing alt text across 183 images, a rebuild still reported them all
missing. The conclusion drawn was that the fix had failed.

**Why the checks missed it:** `content/` is a pinned submodule, so the build rendered the last
pushed vault commit rather than the working vault. Nothing in the output distinguishes the two.

**Rule added:** trap T1 in `.kiro/traps.md`, and step 1 of the `verify-the-site` skill is to
compare `git -C content log -1` against the vault's HEAD before drawing any conclusion.

**Lesson:** confirm which inputs you actually built before believing the output.

## 2026-08-19 — a dependency bump is a rendering change until proven otherwise

**What happened:** a grouped Dependabot update landed `preact`, `sharp`, `esbuild` and TypeScript
5.9 → 7.0 — a renderer, an image processor, a bundler and a compiler — and was merged without any
check of the output.

**Why the checks missed it:** at that point nothing compared the built site before and after.

**Rule added:** step 4 of `verify-the-site` requires rebuilding and running `check-site.mjs` after
a dependency bump. Done retrospectively for that merge: all nine metrics were byte-identical, so
it was in fact safe.

**Lesson:** verifying a dependency bump costs one build; discovering it broke rendering costs
however long until someone notices.
