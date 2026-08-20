# Product — KTH vault site

## What it is

A **Quartz v5** static site that publishes a personal KTH study vault to
<https://kasiem024.github.io/KTHObsidianQuartz/>.

This repo is only the publishing machinery. All content lives in a separate repo
(`Kasiem024/KTHObisidan` — note the typo in the name upstream) and is mounted here as the
`content/` **git submodule**. Nothing in `content/` is authored here.

The notes are in **Swedish**; the interface chrome is English because no `sv-SE` locale exists
upstream and the owner has explicitly declined adding one.

## Who uses it

One student, publishing their own coursework. The site is public but incidental — it exists so
the notes are readable on any device, not to serve an audience. There are no comments, no
analytics and no sign-up.

## Shape

| Concern | Choice |
|---|---|
| Generator | Quartz v5 (`quartz.config.yaml` — v5 uses YAML, not `quartz.config.ts`) |
| Branch | **`v5`**, not `main` |
| Content | `content/` git submodule of the vault repo |
| Theme | `@quartz-themes/hackthebox`, dark-only |
| Hosting | GitHub Pages via Actions (`Settings → Pages → Source = GitHub Actions`) |
| Local overrides | `quartz.ts` (component options), `quartz/styles/custom.scss` (site-only CSS) |
| Custom code | `plugins/flashcards/` (transformer), `tools/slim-svg.mjs` (post-build) |

Roughly 600 pages and 90 MB built — 601 pages exactly, and 90 MB *after* `slim-svg`; a local
build is 105.5 MB because that step only runs in `deploy.yml`.

## Publishing

A plain `git push` in the **vault** repo is enough. The workflow runs
`git submodule update --remote --recursive content`, so CI always builds the vault's newest
commit rather than the pinned pointer, and it also runs hourly on a cron. Use
*Run workflow* for an immediate rebuild.

## Two pieces of custom code, and why they exist

- **`plugins/flashcards/`** — the vault holds ~1,900 spaced-repetition cards written in
  `obsidian-spaced-repetition` syntax, which would otherwise publish as unreadable
  run-together prose. This rewrites them into collapsed callouts at build time. The vault is
  never modified, so the review schedule stays intact.
- **`tools/slim-svg.mjs`** — the Excalidraw pages embed enormous inline SVGs (one held 1,731
  freehand paths). Rounding coordinates to integers takes the site from ~105 MB to ~90 MB.

## Status

Settled and working. `PROJECT-NOTES.md` records the setup decisions, the traps found while
making them, and the things that were tried and did **not** help.

## What it is not

- Not a general-purpose Quartz template — it carries vault-specific assumptions.
- Not the place to edit notes. Content changes belong in the vault repo.
- Not a fork of Quartz: it is a normal install plus one local plugin, one post-build script
  and two small override files.
