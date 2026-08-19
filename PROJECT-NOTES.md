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

Only content under a `## Flashcards` heading is touched — `::` elsewhere in the vault is
a Dataview inline field.

**Five card forms exist in this vault.** The first implementation handled only the first
and left 114 pages showing raw syntax:

1. `Question:: Answer` / `Question;; Answer` — single line.
2. `Question ??` — separator trailing the question.
3. A **bare** `??` or `||` alone on its own line: question on the line(s) above, answer
   on the line(s) below, often a bullet list. The most common multi-line form.
4. `DISABLED` / `==DISABLEDFLASHCARD==` in place of a separator, marking a card switched
   off for review. Rendered like any other card, marker dropped.
5. The same marker used **inline** in place of `::`.

Current state: 326 pages have a Flashcards section, 316 render callouts, 10 sections are
genuinely empty, 686 callouts total, **0 pages showing raw card syntax**.

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

## Other notes

- There is no `sv-SE` locale upstream, so `locale` stays `en-US` and the interface
  chrome is English on an otherwise Swedish site.
- Frontmatter date aliases recognised natively: `created`/`date`, and
  `modified`/`lastmod`/`updated`/`last-modified`. The vault's `created:` and `updated:`
  both work without configuration.
- Themes come from `saberzero1/quartz-themes` (860 available); live previews at
  `https://quartz-themes.github.io/<theme-name>`. Variants use dot notation, e.g.
  `catppuccin.macchiato`.
- Quartz's own documentation ships inside the upstream repo under `docs/`.

The vault side of this work — conventions, the audit script, and the full change log —
is documented in the vault itself: `Meta/Vault Standard.md` and
`Meta/Vault Findings & Backlog.md`.
