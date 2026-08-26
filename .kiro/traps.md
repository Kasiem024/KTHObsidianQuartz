---
inclusion: auto
description: Facts about this specific Quartz setup that fail silently. Read before building, measuring the output, or concluding that a change had no effect.
---

# Traps

Facts about **this** Quartz setup that will bite you. Nothing here is derivable from the
Quartz docs — each came from an actual wrong result in this repository.

**Every trap here is silent.** The build exits 0 and prints no warning. That is the entry
criterion. There are **seven**; do not add an eighth without reproducing it and recording the
wrong result it produced.

---

## T1 — A local build renders the last *pushed* vault commit, not your working vault

`content/` is a **pinned git submodule**. Editing the vault and rebuilding looks like the
change did nothing.

**What it produced:** two wrong "the change didn't work" conclusions, one reporting 183
images as still missing alt text after the fix had already been applied and verified.

**What to do:** build the live vault explicitly, and confirm which tree you built with
`git -C content log -1` against the vault's own HEAD.

```
npx quartz build -d "G:\My Drive\KTHObsidian" -o C:\Temp\out
```

## T2 — `-d` is the *content* directory, despite the docs

The CLI docs table calls `-d` the project directory. It is the content directory and defaults
to `content` (confirmed in `quartz/cli/args.js`). Point it at a repo root and you build
nothing useful, with no error.

## T3 — A local plugin without a `build` script is skipped, and the build still exits 0

`quartz plugin install` runs `npm run build` inside the plugin directory. With no such script
it prints `✗ <name>: build failed`, skips the plugin, and the overall build succeeds — so the
site simply renders as though the plugin did not exist.

**What to do:** every local plugin needs a script, even a no-op:
`"build": "node -e \"process.exit(0)\""`.

## T4 — A named inner function inside a serialized `sortFn` throws in the browser

Functions passed via `componentRegistry.setOptionOverrides` are serialized with
`toString()` and rebuilt with `new Function(...)` in global scope. esbuild wraps a **named**
inner function in a `__name()` helper that does not exist client-side, so the comparator
throws rather than merely misbehaving — and the page still loads.

**What to do:** keep such functions entirely self-contained, with no named inner functions
and no references to the enclosing module.

## T5 — Quartz does not skip dot-folders

Only the paths listed in `ignorePatterns` are excluded. `.obsidian`, `.trash`, `.git` and
`.kiro` are each listed explicitly for that reason.

**What it produced:** without the `.kiro` entry, the vault's agent documentation would have
been published on the public site.

**What to do:** any new dot-folder in the vault needs adding to `ignorePatterns`, and the
proof is that a build emits no file matching it.

## T6 — No PDFs are emitted at all, so links into them 404

The build produces zero `.pdf` files. The course literature is copyrighted and deliberately
unpublished, so wikilinks pointing at PDFs resolve in Obsidian and are dead on the site.

**What it produced:** **43** broken internal links, invisible until `check-site.mjs` resolved
hrefs against the emitted routes. They are baselined at 85, so the check fails only if the
count rises.

## T7 — Grepping built HTML without stripping `<script>`, `<pre>` and `<code>` reports false defects

Inline JavaScript contains `||`, and the vault's Meta docs quote flashcard syntax. Both read
as leaked card syntax.

**What it produced:** a report of 34 leaking pages, one of which was the 404 page's own
script.

**What to do:** use `tools/check-site.mjs`, which strips them. If you must grep by hand,
strip them first — and state which pages you inspected, because a claim scoped to a subset
sounds identical to a claim about the whole site.

---

## T8 — A local build is ~18% bigger than the deployed site, and nothing says so

`tools/slim-svg.mjs` is a **post-build** step that exists only as a line in `deploy.yml`
(`node tools/slim-svg.mjs public 0`). There is no npm script for it, so `npx quartz build`
never runs it. Every size figure in `PROJECT-NOTES.md` and `.kiro/steering/product.md`
describes the *deployed* artifact, after slimming.

**What it produced:** a local build measuring 105.5 MB total / 82.8 MB of HTML with a
6,796 KB heaviest page — which are exactly the "before" numbers in the docs, inviting the
conclusion that the slimming had stopped working. It had not; it simply had not run.

**What to do:** compare a local build against 105.5 MB / 82.8 MB / 6,796 KB, and only
compare against ~90 MB / 67.4 MB / 5,203 KB after running `node tools/slim-svg.mjs <dir> 0`
yourself. Page count and every `check-site.mjs` metric are unaffected either way.

---

## T9 - A Windows build emits 693 HTML files where CI emits 1269, and both are correct

Quartz emits a 448-byte redirect stub at each note's **original-cased** path
(`KTH/2026-Höst/HI1031-.../Replikering.html`) containing `meta http-equiv="refresh"`,
`rel=canonical` and `robots: noindex`, pointing at the lowercase slug it actually serves.

Linux keeps both files. **NTFS is case-insensitive, so each pair collapses into one.** CI's own
artifact listing: 1269 HTML = **576 mixed-case stubs + 693 real pages**. A Windows build cannot
produce 1269 and CI cannot produce 693.

This cost three attempts to diagnose. A baseline of 1270 was taken from a CI log, "corrected" to
693 from a local build, and each looked like a 45% regression from the other side.

**What to do:** nothing, as long as you leave the metric alone. `check-site.mjs` counts
**distinct case-insensitive routes**, so both platforms report `pages 693` and a locally-taken
baseline is valid. If you ever change that expression back to `files.length`, the local build
becomes permanently red against CI. The stubs contribute no callouts, images or `<a>` links,
which is why every other metric already matched exactly - including `brokenInternalLinks`, 85 on
both.

---

## Keeping this file honest

A trap that no longer reproduces is a **finding against this file**, not against the site.
Delete it and note the removal. The same applies to any number quoted here — if
`site-baseline.json` moves, this file is stale.
