---
inclusion: auto
description: Hard rules and traps for this Quartz site - the submodule build trap, plugin overrides, and how to verify a change. Read before touching the config or building.
---

# Conventions — KTH vault site

`PROJECT-NOTES.md` is the **source of truth** for how this site is set up and why. Read it
rather than re-deriving; update it in the same change when something changes.

This file covers the rules that are easy to get wrong.

## 1. A local build does not see uncommitted vault edits

`content/` is a **pinned submodule**, so `npx quartz build` reflects the last *pushed* vault
commit. Editing the vault and rebuilding appears to do nothing — this has produced false
"the change didn't work" conclusions more than once, once showing 183 images as missing alt
text that had already been fixed.

To build the live vault without touching the submodule:

```
npx quartz build -d "G:\My Drive\KTHObsidian" -o C:\Temp\out
```

`-d` is the **content** directory and defaults to `content`, despite the docs table calling it
the project directory. Confirmed in `quartz/cli/args.js`.

## 2. Never edit `content/`

It is the vault, mounted read-only in spirit. Content fixes belong in the vault repo, which has
its own standard and audit.

## 3. Options that YAML cannot express go in `quartz.ts`, via the registry

The Quartz docs show `import * as ExternalPlugin from "./.quartz/plugins"`. That barrel is only
generated for **git-installed** plugins. These are npm packages, so:

```ts
import { componentRegistry } from "./quartz/components/registry"
componentRegistry.setOptionOverrides("explorer", { sortFn })   // before loadQuartzConfig()
```

**A function passed this way is serialised to the browser** with `sortFn.toString()` and rebuilt
via `new Function(...)` in global scope. It must therefore be entirely self-contained: no
references to the enclosing module, and **no named inner functions**, because esbuild wraps
those in a `__name()` helper that does not exist client-side — the comparator throws rather than
merely misbehaving.

## 4. A local plugin needs a `build` script even with nothing to build

`quartz plugin install` runs `npm run build` in the plugin directory. Without a script it prints
`✗ <name>: build failed`, skips the plugin, and **the build still exits 0** — so it looks like
the plugin simply did nothing. A no-op satisfies it:

```json
"scripts": { "build": "node -e \"process.exit(0)\"" }
```

## 5. Verify a change by building and measuring

Do not claim an effect you have not measured. `tools/check-site.mjs` does the measuring, and
runs in CI before every deploy, so a broken build cannot ship:

```
npx quartz build -d "G:\My Drive\KTHObsidian" -o C:\Temp\out
node tools/check-site.mjs C:\Temp\out
```

| Check | Expected |
|---|---|
| Raw flashcard syntax in visible page text | 0 |
| `<img>` without `alt` | 0 |
| Pages with `katex-error` | 0 |
| `brokenInternalLinks` | must not exceed the 43 in `site-baseline.json` |
| Any count vs `site-baseline.json` | may grow; a drop over 5% fails |
| Build exit code | 0 |

The baseline comparison is deliberately asymmetric: growth is normal, shrinkage means
something stopped rendering. That is what would have caught the transformer silently missing
34 notes. Re-baseline an intentional change with `--update`.

When grepping built HTML yourself, strip `<script>`, `<pre>` and `<code>` first — inline
JavaScript contains `||`, and the Meta docs quote card syntax, both of which otherwise read as
defects.

## 6. Things already tried that do not work

Do not spend time re-testing these:

- **`robots.txt`** — a vault-root file does publish at the site root, but crawlers only honour
  `robots.txt` at the *domain* root, and this is a project site on a subpath. It would be inert.
- **`darkMode: auto`** is not emitting duplicate light/dark Excalidraw SVGs; there is exactly
  one large SVG per page.
- **`enableInteraction`** does not reduce Excalidraw geometry.
- **A `sv-SE` locale** does not exist upstream. The owner has declined adding one — do not
  propose it again.

## 7. Plugins that are off, and inert plugins that are on

Both states are deliberate and recorded in `PROJECT-NOTES.md`. `canvas-page`, `bases-page`,
`alias-redirects` and the `mermaid` / YouTube / block-reference options have nothing to act on
in this vault; the owner chose to leave them enabled. Do not "clean them up", and do not read
their inertness as a misconfiguration.
