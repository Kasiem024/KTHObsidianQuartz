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

## Workflow

1. **Establish which content you are about to build.** Compare `git -C content log -1` with the
   vault's own HEAD. If they differ and you care about the working vault, use `-d`.
2. **Build.**

   ```
   npx quartz build -d "G:\My Drive\KTHObsidian" -o C:\Temp\out
   ```

3. **Verify with the script, not by eye.**

   ```
   node tools/check-site.mjs C:\Temp\out
   ```

4. **Investigate anything it flags**, using the sample paths it prints.
5. **Report** in the format below.

## When something goes wrong

- **The change appears to have no effect** → you almost certainly built the pinned submodule.
  Re-read `.kiro/traps.md` T1 before concluding anything.
- **`check-site` fails on a count drop** → find out what stopped rendering. Do **not** reach
  for `--update` to make it green; re-baseline only once you can explain the new number.
- **A local plugin seems inert** → it has no `build` script, so install skipped it and the
  build still exited 0 (T3).
- **The build errors** → report the error verbatim and stop. Do not work around it by
  disabling a plugin.

## Output format

- **Verdict first**: build exit code, then each metric against `site-baseline.json`.
- **What changed** versus the baseline, with the explanation for any movement.
- **What you did not check.** Mandatory. A pass means the checks that ran found nothing; it is
  never a statement that the site is good. Name the blind spots — visual layout, mobile,
  Swedish search, formula legibility, drawing readability — and point at `MANUAL-CHECK.md`.
- **Next action**, if any.

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
