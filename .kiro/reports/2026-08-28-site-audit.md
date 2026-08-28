# Site audit — Quartz repo (C:\dev\KTHObsidianQuartz)

**Date:** 2026-08-28
**Auditor:** quartz-audit (automated stage)
**Repo:** `C:\dev\KTHObsidianQuartz`, branch `v5`
**Vault built:** `G:\My Drive\KTHObsidian` @ `8a5db45` (the commit the prior vault-fix stage pushed to `origin/main`)
**Scope:** Part 2 of `G:\My Drive\KTHObsidian\.kiro\reports\2026-08-28-fix-and-audit-prompt.md`

---

## Verdict: PASS

The site builds cleanly against the live vault and against the freshly-updated submodule.
Every `check-site.mjs` metric equals the baseline; all three zero-tolerance invariants are 0;
`brokenInternalLinks` is 44, exactly at the ceiling. CI is healthy and the deployed build
matches this local build on every metric. Two stale numbers in `PROJECT-NOTES.md` were found
and corrected (doc fixes, not measurement changes). The content submodule was advanced to the
pushed vault HEAD and re-verified.

Nothing here is a blocker. No change alters published output.

---

## Findings

| # | Severity | Finding | Evidence | Action |
|---|---|---|---|---|
| S1 | Low (fixed) | `PROJECT-NOTES.md` said "26 note links to these PDFs are dead on the site only". The measured count is **43** PDF-target broken links. Stale since the vault gained 92 notes (F59). | Enumerated all 44 broken links from the build: 43 PDF-target + 1 non-PDF. | Fixed doc: "43 links into these PDFs…". |
| S2 | Low (fixed) | `PROJECT-NOTES.md` parenthetical said broken links "Went 43 → 85 … one of the 85 is the MOC link", contradicting the "baselined at **44**" sentence directly above it. The 85 was the F59 peak; F60+F61 dropped it to 44. | `check-site` reports `brokenInternalLinks 44`; `site-baseline.json` `_meta` documents 74→44 on 2026-08-27 (F61). | Fixed doc: history now ends "…then fell to 44 on 2026-08-27 … one of the 44 is the MOC link". |
| S3 | Low (not fixed) | `.node-version` pins `v22.16.0`, but `deploy.yml` uses `node-version: 24` and the deployed build ran on `node 24.19.0`. The two disagree. | `.node-version` = `v22.16.0`; `deploy.yml` `setup-node` `node-version: 24`; deployed `build-report.json` platform `linux node 24.19.0`. | Left as-is — it is the author's local env pin and harmless (CI uses the explicit `24`). Recommend aligning to avoid local/CI drift. See recommendations. |
| — | Chore | Content submodule was behind the vault HEAD. | Submodule was `a44efa6`; vault `origin/main` = `8a5db45`; `a44efa6` is an ancestor of `8a5db45` (clean fast-forward). | Advanced `content` to `8a5db45`, rebuilt, re-checked — all metrics identical. |

---

## What was checked (with evidence)

### 2a. Build against the live vault
`cmd /c "npx quartz build -d "G:\My Drive\KTHObsidian" -o C:\Temp\out"` → **exit 0**.
Log: `Quartz v5.0.0 … Found 549 input files from G:\My Drive\KTHObsidian … Filtered out 17 …
Emitted 1432 files`. Confirmed it built the live vault (not the pinned submodule), and the
vault working tree is at `8a5db45` = the pushed commit (`git ls-remote` on the vault matched).

### 2b. Site checker — all metrics vs `site-baseline.json`
`node tools/check-site.mjs C:\Temp\out` → **exit 0, check-site OK**.

| Metric | Build | Baseline | Status |
|---|---|---|---|
| pages | 648 | 648 | = |
| pagesWithCallouts | 397 | 397 | = |
| questionCallouts | 2233 | 2233 | = |
| images | 183 | 183 | = |
| imagesWithoutAlt | 0 | 0 | = (zero-tolerance ✓) |
| katexErrorPages | 0 | 0 | = (zero-tolerance ✓) |
| cardLeakPages | 0 | 0 | = (zero-tolerance ✓) |
| internalLinks | 38241 | 38241 | = |
| brokenInternalLinks | 44 | 44 | = (ceiling, not exceeded ✓) |

No metric dropped (the >5% drop check found nothing). Broken links break down as **43 PDF
targets + 1 non-PDF** (the `atlas/2026-moc → …/ht100x-examensarbete` thesis placeholder),
across 42 distinct source notes — matching `site-baseline.json`'s `_meta` description.

The identical-to-baseline result is expected: the vault-fix stage only touched tooling and
`Meta/` files, all of which are in `ignorePatterns`, so published output is unchanged.

### 2c. CI workflow health
One workflow, `deploy.yml`. Triggers: push to `v5`, hourly `cron`, `workflow_dispatch`.
Permissions scoped to `contents:read, pages:write, id-token:write`; `concurrency: pages`.
Step order is correct: checkout(recursive submodules) → setup-node → `git submodule update
--remote` → caches → `npm ci` → plugin install → **test-check-site** → build → **slim-svg** →
**check-site** → upload → deploy.

Action versions (all pinned to a major, Dependabot updates `npm` + `github-actions` weekly):
`actions/checkout@v7`, `actions/setup-node@v7`, `actions/cache@v6`,
`actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`. None appear deprecated; I could
not independently confirm "latest" without network, but Dependabot keeps them current.

- `node tools/test-check-site.mjs` (the CI fast-fail step) → **22 assertions, 0 failed**.
- `node tools/check-site.mjs C:\Temp\out --compare-ci` → **every metric matches the deployed
  build** (deployed `2026-08-27T23:28:46Z` on `linux node 24.19.0`; local on `win32 node
  26.4.0`). This confirms the last deploy succeeded, the site serves `/build-report.json`, and
  every metric is machine-independent.

### 2d. `PROJECT-NOTES.md` accuracy
Every figure `check-site.mjs` reports matches the doc: 648 pages, 397 pages-with-callouts,
2233 callouts, 183 images, 38241 internal links, 44 broken. Two prose figures about broken
links were stale (S1, S2) and were corrected in the doc — never the measurement, per the
documentation standard.

### 2e. Submodule update + re-verify
`content` advanced `a44efa6 → 8a5db45` (verified ancestor → fast-forward). Rebuilt from the
submodule (`npx quartz build -o C:\Temp\out2`, default `-d content`) → **exit 0**, `Found 549
input files from content`. `check-site` on that build → **all metrics identical to baseline,
exit 0**. The pointer bump broke nothing.

Note: CI does not strictly need this pointer (it runs `git submodule update --remote` every
build), but keeping it current makes local `npx quartz build` reflect the latest vault and
keeps the audit trail honest.

---

## What was NOT checked

`check-site.mjs` prints its own blind spots; they hold here. Nothing in this audit opened a
browser. Not verified:

- Visual layout, spacing, dark-theme legibility.
- Mobile rendering and page weight on mobile data (the Excalidraw pages are ~5 MB each).
- Whether search finds Swedish terms with `å ä ö` or course codes.
- KaTeX *legibility* (only render-error count is 0, not readability).
- Excalidraw drawing readability at phone width.
- Whether a link's target contains what its text promises; Swedish prose accuracy.
- The `slim-svg` size reduction — a local build does not run it (trap T8), so build size
  (~105 MB local vs ~90 MB deployed) was not measured or compared here.
- Live CI run status on GitHub (no network to the Actions API); inferred healthy from the
  deployed `/build-report.json` matching and from `test-check-site` + `check-site` passing
  locally on the same toolchain logic.

These need a person — see `MANUAL-CHECK.md`, Priority 1 (~10 minutes).

---

## Recommended fixes

1. **S3 (optional):** Align `.node-version` with CI. Either set it to the CI major (`24`) so a
   local version manager matches the deployed runtime, or add `node-version-file: .node-version`
   to `setup-node` and drop the hardcoded `24`, so there is a single source of truth. Left
   undone because it is the author's local pin and both versions build the site correctly.
2. **No action needed** on the 44 broken links: they are the accepted PDF/thesis links,
   baselined as a must-not-rise ceiling.

---

## Commits produced (branch `site-audit-2026-08-28`, NOT pushed)

1. `docs: correct stale broken-link figures in PROJECT-NOTES; add 2026-08-28 site audit report`
   — the S1/S2 fixes and this report.
2. `chore: update vault submodule to latest` — `content` → `8a5db45`.

**Not pushed.** This repo auto-deploys on push to `v5`; the branch is held locally pending
owner confirmation.
