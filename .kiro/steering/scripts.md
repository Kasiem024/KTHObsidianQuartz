---
inclusion: auto
description: The scripts in tools/ - what each one measures, when to run it, and what none of them can see. Read BEFORE writing a new script against this repo, and before quoting any number about the site.
---

# Script library — KTH vault site

**Check this list before writing a script.** Four of these exist because the same question came
up twice, and the fifth exists because a number in prose went stale twice in the same month.

A script is a measurement whose **definition is recorded**, which is the part that keeps getting
lost here: `pages` once meant two different things to two machines and nothing in the repo said
which (T9). If you add a metric, declare what it counts in `METRIC_UNITS`
(`tools/lib/page-count.mjs`) — `tools/test-check-site.mjs` fails if a baselined metric has no
entry.

| Script | Answers | Needs a build? | Exit code |
|---|---|---|---|
| `tools/check-site.mjs` | Does the built site hold up? | yes | 0 clean / 1 finding |
| `tools/test-check-site.mjs` | Does `pages` still mean what it claims? | no | 0 pass / 1 |
| `tools/check-docs.mjs` | Do the docs still agree with `site-baseline.json`? | no | 0 clean / 1 finding |
| `tools/slim-svg.mjs` | Shrink the Excalidraw SVGs (~105 MB → ~90 MB) | yes, runs on output | 0 / 1 |

`npm run check` (`tsc --noEmit && prettier --check`) is **not** in CI and currently fails on
`tsconfig.json` — see `PROJECT-NOTES.md`. Do not read a green deploy as a green type check.

## Which one to reach for

- **Changed a plugin, transformer, config option or dependency** → build the live vault and run
  `check-site.mjs`. See the `verify-the-site` skill; the pinned-submodule trap will otherwise
  show you stale content.
- **Changed what a metric counts** → `test-check-site.mjs`, in the same change.
- **Edited any doc, or quoted a figure** → `check-docs.mjs`. It is instant and needs no build.
- **About to quote a number about the site** → read `site-baseline.json`, not the prose. The
  baseline is machine-generated; prose is convenience.

## What no script here can see

`check-site.mjs` prints its own blind spots on every run, and this is the short version:
visual layout, mobile rendering, whether Swedish search handles `å ä ö`, whether a formula is
*legible* rather than merely error-free, whether a drawing reads at phone width. Those are
`MANUAL-CHECK.md`, ordered so Priority 1 takes about ten minutes.

`check-docs.mjs` has one more, stated in its header: it only sees a figure whose **metric name**
appears on the same line. `pages` and `images` are ordinary English words and are excluded
deliberately — matching them as substrings produced 20 findings of which 19 were nonsense. So
when you quote a baselined number in prose, name the metric next to it.

## Rules for adding one

1. **Declare what it counts**, in a header comment and in `METRIC_UNITS` if it is a metric.
   Not what it does — what its numbers mean, and what is in and out of scope.
2. **Read-only unless the name says otherwise.** `slim-svg.mjs` is the only writer, and it
   operates on build output, never on the repo or the vault.
3. **Exit 0 for clean, 1 for a finding**, so CI can gate on it.
4. **Never touch `content/`.** That is the vault, with its own standard, audit and CI.
5. **Validate the predicate before trusting the result.** The first draft of `check-docs.mjs`
   was 95% false positives; a red check over the wrong predicate gets ignored just as fast as a
   green one. Run it against the current repo and read every finding before wiring it into CI.
6. **Add it to the table above in the same change**, and to `.github/workflows/deploy.yml` if it
   can run without a build.
