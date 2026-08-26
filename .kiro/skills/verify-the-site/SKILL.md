---
name: verify-the-site
description: How to build and verify the KTH vault site, including the pinned-submodule trap that makes local builds show stale content. Use when changing a plugin, transformer, config option or dependency, or when a change appears to have had no effect.
---

# Verifying the site

A zero exit code is not evidence that a change worked. **Every defect this site has had
passed the build cleanly** — 34 pages published raw flashcard syntax for weeks, and 183
images shipped with no alt text, both with green builds.

## 1. Build the right content

`content/` is a **pinned git submodule**, so a plain `npx quartz build` renders the last
*pushed* vault commit, not the working vault. This has produced at least two wrong "the
change didn't work" conclusions, including one where 183 images were reported as still
missing alt text after the fix had already been applied.

```
npx quartz build -d "G:\My Drive\KTHObsidian" -o C:\Temp\out
```

`-d` is the **content** directory and defaults to `content`, despite the docs table calling
it the project directory (confirmed in `quartz/cli/args.js`).

Before drawing any conclusion, confirm which tree you built:
`git -C content log -1` against the vault's own HEAD.

## 2. Run the checker, don't hand-grep

```
node tools/check-site.mjs C:\Temp\out
```

~2 s over 600 pages. It enforces zero-tolerance invariants (raw card syntax in visible text,
images without `alt`, KaTeX errors) and compares everything else against
`site-baseline.json`. The same script gates the deploy, so if it passes locally it will pass
in CI.

The baseline comparison is **asymmetric on purpose**: counts may grow freely, but a drop over
5% fails. Growth is you adding notes; shrinkage means something stopped rendering. That is
what would have caught the transformer silently missing 34 notes.

`brokenInternalLinks` is baselined at **85**, not 0 — almost all point into PDFs and Quartz emits
no PDFs, because the course literature is copyrighted and deliberately unpublished. One is the
MOC link to the degree project, which is deliberately unpublished until examined. The check
fails only if the count rises.

**Always build into an empty directory.** `check-site.mjs` refuses `--update` when the pages
were written over more than 300 seconds, because that means the directory holds output from two
builds and every count is inflated. Separately: `pages` counts distinct case-insensitive routes,
not raw `.html` files, because Quartz emits an original-case redirect stub per note - 1269 files
on Linux, 693 on Windows, 693 routes on both.

**If a count disagrees with CI, do not pick a number.** Every build publishes its own
measurements, so run:

```
node tools/check-site.mjs <dir> --compare-ci
```

It fetches `/build-report.json` from the deployed site and exits 1 naming any metric that is not
machine-independent. Then fix what the metric *counts* in `tools/lib/page-count.mjs`, and add an
assertion to `tools/test-check-site.mjs` so it cannot regress. That test runs in CI on every
push and fails if a baselined metric has no declared unit.

Re-baseline a deliberate change: `node tools/check-site.mjs public --update`, and say in the
commit why the numbers moved.

## 3. If you must grep the HTML yourself

Strip `<script>`, `<pre>` and `<code>` first. Inline JavaScript contains `||` and the vault's
Meta docs quote card syntax — skipping this reported 34 leaking pages, one of which was the
404 page's own script.

State the scope of what you inspected. A "0 raw card syntax" claim was wrong for weeks
because it only looked at pages containing `id="flashcards"`.

## 4. Verify a dependency bump the same way

Dependency updates can silently change output: `preact` renders the HTML and `sharp` produces
the social images. After merging a bump, run `npm ci`, rebuild the live vault and run the
checker. The 2026-08-19 group update (preact, sharp, esbuild, TypeScript 5.9 → 7.0) produced
byte-identical metrics on all nine measures — which is the answer you want, and only knowable
by checking.

## 5. Do not re-test what is already ruled out

`.kiro/steering/conventions.md` §6 lists things tried that do not work — `robots.txt` on a
project subpath, `darkMode: auto` duplicating Excalidraw SVGs, `enableInteraction` reducing
geometry, and a `sv-SE` locale (declined by the owner; do not propose it again).

## 6. Never edit `content/`

That is the vault, with its own standard, audit and CI. Content fixes belong in the vault
repo. A hook blocks writes into `content/` as a backstop.
