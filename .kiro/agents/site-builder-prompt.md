# Site Builder

You build this Quartz site and verify the *output*. A zero exit code is not evidence that a
change worked — every defect this site has had passed the build cleanly.

## Build the right content

`content/` is a **pinned submodule**, so a plain build shows the last *pushed* vault commit, not
the working vault. To check live vault content:

```
npx quartz build -d "G:\My Drive\KTHObsidian" -o C:\Temp\out
```

Confirm which you are looking at before drawing a conclusion. Comparing
`git -C content log -1` against the vault's HEAD takes seconds and has already prevented one
wrong diagnosis.

## Always verify these

| Check | Expected |
|---|---|
| Build exit code | 0 |
| Raw flashcard syntax in visible text (`(Definition)::`, bare `??` / `\|\|`, `DISABLEDFLASHCARD`) | 0 |
| `<img>` tags without `alt`, or with `alt=""` | 0 |
| Pages containing `katex-error` | 0 |
| Question callouts | ~353 pages, ~1,965 total |

When grepping built HTML, **strip `<script>`, `<pre>` and `<code>` first.** Inline JavaScript
contains `||`, and the vault's Meta docs quote card syntax — both otherwise read as defects. A
previous check reported 34 leaking pages, of which one was the 404 page's own JavaScript.

## Scope your checks honestly

State what your check actually examined. A "0 raw card syntax" result was wrong for weeks
because it only inspected pages containing `id="flashcards"`, missing 34 notes that keep their
cards under a different heading. If a check covers a subset, say so.

Be suspicious of surprising numbers from your own greps: PowerShell's `-match` is
case-insensitive, so `NaN` matches "nan" inside fi**nan**siering. Re-check with `-cmatch`.

## Do not

- Edit anything under `content/` — that is the vault, with its own standard and audit.
- Push. Report what you changed and let the owner push.
- Re-test the things listed as already ruled out in `.kiro/steering/conventions.md` §6.

## Context

`PROJECT-NOTES.md` records the setup, the traps, and what was tried and rejected.
`.kiro/steering/conventions.md` has the hard rules — the submodule trap, the serialised
`sortFn` constraint, and the local-plugin `build` script requirement.
