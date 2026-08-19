# KTH vault site — setup notes

This repo publishes the KTH Obsidian study vault at
<https://kasiem024.github.io/KTHObsidianQuartz/> using **Quartz v5**.

It is a normal Quartz install plus one local plugin and a handful of deliberate
choices. Those choices, and the traps found while making them, are recorded here so
they do not have to be rediscovered.

## Layout

| Path | What it is |
| --- | --- |
| `content/` | **git submodule** of the vault repo (`Kasiem024/KTHObisidan`) |
| `quartz.config.yaml` | v5 uses YAML, not `quartz.config.ts` |
| `quartz.ts` | option overrides that cannot be expressed in YAML |
| `plugins/flashcards/` | local transformer, rewrites spaced-repetition cards |
| `quartz/styles/custom.scss` | site-only rules that hide Obsidian-only artifacts |
| `.github/workflows/deploy.yml` | build + deploy to GitHub Pages |

Branch is **`v5`**, not `main`.

## Publishing

A plain push to the **vault** repo is enough. `deploy.yml` runs

```
git submodule update --remote --recursive content
```

so CI always builds the newest vault commit rather than the pinned pointer, and it has
an hourly `schedule:` cron plus `workflow_dispatch`. There is no need to bump the
submodule pointer by hand. Use *Run workflow* for an immediate rebuild.

`Settings → Pages → Source` must stay on **GitHub Actions**.

## Gotchas, each of which cost real time

### Local builds do not see uncommitted vault edits

`content/` is a pinned submodule, so `npx quartz build` reflects the last **pushed**
vault commit. Editing the vault and rebuilding appears to do nothing.

To verify live vault content without touching the submodule:

```
npx quartz build -d "G:\My Drive\KTHObsidian" -o C:\Temp\out
```

`-d` is the **content** directory and defaults to `content`, despite the docs table
describing it as the project directory. Confirmed in `quartz/cli/args.js`.

### A local plugin needs a `build` script even when there is nothing to build

Local plugins load via `source: "./plugins/<name>"` (see `isLocalSource` in
`quartz/plugins/loader/gitLoader.ts`, which accepts `./`, `../`, `/` or a Windows drive
letter). The installer runs `npm run build` in the plugin directory, so without a
script the install fails with `✗ <name>: build failed` — and, worse, **the build still
exits 0**, so it looks like the plugin simply did nothing. A no-op is enough:

```json
"scripts": { "build": "node -e \"process.exit(0)\"" }
```

### The explorer's `sortFn` is serialised to the browser

The explorer stores its options in a `data-data-fns` attribute and rebuilds the
comparator client-side with:

```js
new Function("a", "b", "return (" + E.sortFn + ")(a, b)")
```

That runs in **global scope**, so the function must be completely self-contained:

- no references to anything in the enclosing module, and
- **no named inner functions** — esbuild wraps those in its `__name()` helper, which
  does not exist once the string is rebuilt, so the comparator throws rather than
  merely sorting oddly.

Everything in the comparator in `quartz.ts` is therefore inlined. It can be verified
without a browser by parsing `data-data-fns` out of `public/index.html`, rebuilding the
function the same way, and sorting a sample.

### npm-installed plugins are overridden through the registry, not the docs' barrel

The docs show `import * as ExternalPlugin from "./.quartz/plugins"`. That barrel is
only generated for **git-installed** plugins. These are npm packages, so:

```ts
import { componentRegistry } from "./quartz/components/registry"
componentRegistry.setOptionOverrides("explorer", { sortFn })   // before loadQuartzConfig()
```

### Folder pages need an explicit `title`

`_index.md` does become the folder page (it slugifies to `index.html`), but without a
`title:` in frontmatter Quartz falls back to the filename and every course page is
titled `_index`.

## The flashcard transformer

`plugins/flashcards/` rewrites obsidian-spaced-repetition cards into **collapsed
Obsidian callouts** at build time. The vault is never modified, so the review schedule
and its `<!--SR:...-->` data stay intact.

It runs at `order: 25`, ahead of `obsidian-flavored-markdown` (30), because
`textTransform` happens before parsing.

Callouts rather than raw `<details>`: callout bodies are still parsed as markdown, so
LaTeX, wikilinks, bold and **list answers** keep working. Raw HTML bodies would not be,
because `enableInHtmlEmbed` is `false`.

**It processes the whole note body, not just a `## Flashcards` section.** An earlier version
only looked under that heading and silently missed **34 notes** — some with 150+ cards — that
keep their cards under a differently named heading (`## Begrepp`,
`## 📝 Ursprungliga Flashcards`) or interleaved with prose under chapter headings. Those pages
published raw `::` syntax. Widening the scope is safe here, verified rather than assumed:
there are **zero** bracketed Dataview inline fields (`[key:: value]`) in the vault, and no
namespace-style code (`std::`) outside fenced blocks. Fenced blocks, table rows and existing
blockquotes are skipped regardless.

**The four separators are not interchangeable.** From the plugin's own settings: `::` is
single-line one-directional, `;;` single-line **reversed**, `||` multi-line one-directional,
`??` multi-line **reversed**. A reversed card also generates a back-to-front card. Rendering
flattens the distinction to one question → answer callout, which is right for reading; the
direction only matters when reviewing in Obsidian. Never rewrite one form into another.

Two edge cases the vault actually contains, both handled:

- **No blank line between cards.** The answer collector used to swallow the *next* card's
  question, orphaning its `??` so it printed raw. It now stops when the following line is a
  bare separator.
- **Cards with no answer** — `Term (Definition)::` with nothing after it, five of them. The
  question renders as plain text and the dangling separator is dropped. These are a content
  gap in the vault, not a rendering bug.

Current state: **353 pages render callouts, 1,965 callouts total, 0 pages showing raw card
syntax.** When checking that last figure, strip `<script>`, `<pre>` and `<code>` first —
inline JavaScript contains `||` and the vault's Meta docs quote card syntax.

## Deliberate exclusions

`ignorePatterns` in `quartz.config.yaml`:

- `**/Filer/**/*.pdf` — scanned textbook chapters and lecturer slide decks. A copyright
  exposure on a public site, and 262 MB of the build. They stay in the vault, so links
  still resolve in Obsidian. **26 note links to these PDFs are dead on the site only,
  which is accepted.**
- `**/*Excalidraw*.png` — redundant auto-exports; the drawings render via
  `obsidian-plugin-excalidraw` instead.
- `Meta`, `**/Litteraturlista/**`, `**/*.ai.md`, `**/*.opt.md`, `KTH/Kurs Mapp Mall/**`.
- `Atlas/Dashboard.md`, `Atlas/Vault Health Report.md` — Dataview-only pages that would
  publish as raw query text. Fully functional inside Obsidian.

## Plugins deliberately off

| Plugin | Why |
| --- | --- |
| `darkmode` | `hackthebox` is a dark-only theme, so the toggle has nothing to switch to |
| `encrypted-pages` | nothing in the vault is encrypted |
| `cname` | no custom domain; the site is served from a `github.io` subpath |
| `citations`, `ox-hugo`, `roam`, `explicit-publish`, `stacked-pages`, `comments` | unused |

## custom.scss

Two site-only rules, neither of which touches the vault:

1. **Dataview query blocks are hidden.** Quartz has no Dataview engine, so they would
   render as raw `LIST FROM ...` source.
2. **Section headings with no content are hidden.** The vault Standard requires concept
   notes to carry `## Kopplat till` and `## Flashcards`, so an empty section is correct
   *there* and acts as a prompt to fill in later — it is only noise on the page. An
   empty section is one whose heading is immediately followed by another heading, or one
   that ends the article. A *filled* section cannot match: filled `Kopplat till` is
   followed by `<ul>`, filled `Flashcards` by `<blockquote class="callout question">`.

## Plugin ecosystem — reviewed 2026-08-19

The whole ecosystem was enumerated from the npm registry so this does not have to be
re-researched. **It is small, and this install already covers essentially all of it.**

```
npm search keywords:quartz-plugin --json --searchlimit=2000
```

53 packages carry the `quartz-plugin` keyword, and the figure is stable at higher
limits, so it is a real total rather than a truncation:

| Group | Count |
| --- | --- |
| `@quartz-community` | 50 (52 packages exist in the scope; **49 installed here**) |
| Third-party, everything outside the official scopes | **2** |

### Not installed, and why that is correct

| Package | Why not |
| --- | --- |
| `@quartz-community/obsidian-plugin-leaflet` | renders Obsidian Leaflet maps; the vault has none |
| `@quartz-community/obsidian-plugin-ttrpg-tools-maps` | tabletop-RPG map data; irrelevant |
| `@quartz-community/runtime` | browser helper library for plugin *authors*, not a feature |

### Third-party, evaluated and rejected

- `@kamal-hamza/quartz-plugin-pseudo` — pseudocode rendering with KaTeX. Plausible for
  `HI1029 Algoritmer och Datastrukturer`, but the vault contains **zero** pseudocode
  blocks, zero `\begin{algorithm}` and zero "pseudokod". Nothing for it to render.
- `quartz-navbar` — a top navbar. v0.1.0, single maintainer, outside the official scope.
  The left sidebar already covers navigation, so it is not worth the supply-chain risk.

### Considered but deliberately not enabled

`@quartz-community/stacked-pages` (installed, disabled) gives binder-style stacked tabs,
so following a concept chain opens pages side by side. It is the only disabled plugin that
genuinely suits a densely cross-linked concept vault. **The owner decided against it** —
do not enable it without asking.

The other eight disabled plugins are inapplicable, not merely unused: `citations` needs
BibTeX (this vault cites via wikilinks to PDFs), `roam` and `ox-hugo` are foreign formats,
`explicit-publish` would invert the publish-everything model across 500 notes, `darkmode`
has nothing to toggle on a dark-only theme, `cname` needs a custom domain,
`encrypted-pages` has nothing to encrypt, and `comments` would add a GitHub Discussions
dependency to a personal study site.

### Enabled but inert, deliberately left on

Measured against the vault's actual content, these have nothing to act on:

```
mermaid 0 · .canvas 0 · .base 0 · footnotes 0 · block refs 0 · youtube 0 · aliases 0
```

So `canvas-page`, `bases-page`, `alias-redirects` and the `mermaid`,
`enableYouTubeEmbed` and `parseBlockReferences` options do nothing today. They cost only a
little build time and some config noise, and they start working by themselves if that
content ever appears. **The owner chose to leave them enabled** — this is recorded so the
inertness is not later mistaken for a misconfiguration.

### Content inventory behind those decisions

| Measure | Count |
| --- | --- |
| Notes / PDFs / PNGs / JPGs | 524 / 105 / 84 / 6 |
| Notes containing math | 79 |
| Notes with transclusions | 61 |
| Notes with tables | 52 |
| Notes with callouts | 27 |
| Notes with `%%` comments | 18 |
| Code fences | dataview 145, json 17, c 5, java 1, yaml 1, powershell 1 |

Syntax highlighting is therefore near-unused: 145 of the ~170 fenced blocks are Dataview,
which is hidden anyway.

### Folder pages already replace the hidden Dataview listings

Worth knowing before "fixing" anything: the 24 course `_index.md` pages consist entirely
of Dataview queries, which the site hides — but `folder-page` emits its own listing
alongside them, so the pages are **not** dead ends. Verified on the built output: the
CM1005 `Begrepp` page carries 718 internal links (all 112 concepts), `Föreläsningar`
pages list their notes, and a course page has 15. The Dataview blocks are redundant on the
web rather than lost content, so nothing needs doing.

## Accessibility: image alt text

Image embeds must carry alt text after a pipe:

```markdown
![[Bostonmatrisen ME1003.png|Bostonmatrisen]]
```

`obsidian-flavored-markdown` parses the value after the pipe with:

```
/^(?<alt>(?!^\d*x?\d*$).*?)?(\|?\s*?(?<width>\d+)(x(?<height>\d+))?)?$/
```

A **non-numeric** value becomes the `alt` attribute; `|300` is still a width. Obsidian
treats the same text as the embed's display name, so this is native to both tools — there
is no need to convert anything to `![alt](path)` markdown syntax.

All 183 embeds were bare `![[image.png]]` until 2026-08-19, so every diagram on the site
had `alt=""`. The vault side is now fixed and enforced by the vault audit
(`imageEmbedWithoutAlt`), so this should stay at zero.

## robots.txt does not work on this site

Worth recording so it is not attempted again. A file placed in the vault root **is**
published at the site root — `llms.txt` proves it. But this is a GitHub Pages **project**
site served from `kasiem024.github.io/KTHObsidianQuartz/`, and crawlers only read
`robots.txt` from the **domain** root. A copy at the project subpath is ignored, so adding
one would be dead weight. Controlling crawling would require a `robots.txt` in a separate
`kasiem024.github.io` user-site repo.

`sitemap.xml` and `index.xml` (RSS) are unaffected and are emitted normally.

## Verifying the built site

`tools/check-site.mjs` runs in CI between the slim step and the upload, so a broken build
never reaches GitHub Pages. It takes ~2 s over 600 pages and has no dependencies.

```
node tools/check-site.mjs public            # check
node tools/check-site.mjs public --update   # accept current numbers as the baseline
```

Two kinds of check, and the second is the important one:

1. **Invariants that must be zero** — raw flashcard syntax in visible text, images without
   `alt`, pages with `katex-error`.
2. **A comparison against `site-baseline.json`.** Counts may **grow** freely, because adding
   notes is normal, but a **drop of more than 5% fails**. That asymmetry catches regressions
   nobody wrote a check for: the flashcard transformer once silently missed 34 notes and
   ~1,280 cards, and no named check would have found it, but a callout count falling off a
   cliff is unmistakable.

The current baseline is 601 pages, 353 with callouts, 1965 callouts, 183 images, 35373
internal links.

**`brokenInternalLinks` is baselined at 43, not 0.** All 43 are links into PDFs, and Quartz
emits **no** PDFs at all — the course literature is copyrighted and deliberately unpublished.
So those links work in Obsidian and are dead on the public site. The check fails if the count
*rises*, which catches genuinely new breakage without demanding the accepted 43 be fixed.

When grepping built HTML for defects, strip `<script>`, `<pre>` and `<code>` first: inline
JavaScript contains `||` and the vault's Meta docs quote card syntax. Skipping that step once
produced a false report of 34 leaking pages, one of which was the 404 page's own script.

## Excalidraw page weight, and the slimming step

The 18 Excalidraw pages are the heaviest thing published. Measured cause: a single page's
drawing is one 4,592 KB inline `<svg>` holding **1,731 `<path>` elements averaging 2,641
characters** of coordinate data — freehand geometry, not metadata.

`tools/slim-svg.mjs` runs after the build and rounds coordinates in the large inline SVGs
to integers. `deploy.yml` runs it between *Build Quartz* and *Upload artifact*.

**Measured result: HTML 82.3 MB → 67.4 MB (18.1%), whole site ~105 MB → ~90 MB.** The
heaviest page drops from 6,796 KB to 5,203 KB.

Worth being honest that this was expected to save 40–50% and does not. The coordinates
average only 3.36 decimal places, so most numbers were already short and the 17-decimal
outliers are rare. Rounding to one decimal saved just 7.2%; integers were needed to reach
18%. **A visitor still downloads about 5 MB for one of those pages**, so this reduces the
problem rather than solving it. Removing the step is one line in `deploy.yml` plus the
script; nothing else depends on it.

Three safety properties, each verified with a synthetic fixture:

- **Only SVGs over 50 KB are considered**, so the small UI icons are never touched.
- **Only canvases at least 1,000 units across are rounded.** Rounding shifts a point by at
  most half a unit, which is invisible at these scales — the smallest real drawing is
  4033×2066 — but a large *detailed* drawing on a small canvas would be fragile, and byte
  size alone would not catch that. Such an SVG, or one with no `viewBox`, is skipped and
  reported.
- **Only values with |v| ≥ 1 are rounded**, leaving opacities, stroke widths and scale
  factors alone, where a tenth is a large relative change.
- Structure is compared before and after — counts of `<path`, `d="` and `<g`, plus a check
  for `NaN`/`undefined` — and the build **fails** rather than publishing a mangled drawing.

It is idempotent: after one pass no number has more than one decimal, so re-running changes
nothing.

Things that do **not** help, so do not re-test them:

- `darkMode: auto` is not emitting duplicate light/dark copies. There is exactly one large
  SVG per page; the others are small UI icons.
- `enableInteraction` only toggles the interactivity layer and does not shrink geometry.

## Other notes

- There is no `sv-SE` locale upstream, so `locale` stays `en-US` and the interface
  chrome is English on an otherwise Swedish site.
- Frontmatter date aliases recognised natively: `created`/`date`, and
  `modified`/`lastmod`/`updated`/`last-modified`. The vault's `created:` and `updated:`
  both work without configuration.
- Themes come from `saberzero1/quartz-themes`, whose `#supported-themes` table lists
  **860 theme variants**; live previews at `https://quartz-themes.github.io/<theme-name>`.
  Variants use dot notation, e.g. `catppuccin.macchiato`. Note that
  `npm search keywords:quartz-theme` returns exactly 250 results at **any**
  `--searchlimit`, because the registry search endpoint caps there — so npm cannot be
  used to count the published themes. The repo table is the source of truth.
- Quartz's own documentation ships inside the upstream repo under `docs/`.

The vault side of this work — conventions, the audit script, and the full change log —
is documented in the vault itself: `Meta/Vault Standard.md` and
`Meta/Vault Findings & Backlog.md`.
