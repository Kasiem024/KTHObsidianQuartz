# .kiro — agent context for the site repo

Context for AI agents working on the Quartz site. Modelled on the `.kiro` layout used in
`Kana-App`, trimmed to what a static-site repo needs.

| Path | Purpose |
|---|---|
| `steering/product.md` | What the site is, how publishing works |
| `steering/conventions.md` | Hard rules, traps, and what has already been ruled out |
| `hooks/block-destructive.sh` | `preToolUse` guard — reads stdin, `exit 2` blocks |
| `agents/site-builder.*` | Builds and verifies the output |

## Steering vs. `PROJECT-NOTES.md`

`PROJECT-NOTES.md` is the source of truth for how the site is set up and why — it stays at the
repo root because it is useful to a human reading the repo, not only to an agent. The steering
files hold **how to work on it**, and point at `PROJECT-NOTES.md` rather than duplicating it.

`conventions.md` carries `inclusion: auto` so it loads without being asked for; `product.md` is
plain, matching the reference repo.

## Hooks

A hook reads the tool input on **stdin**, exits `0` to allow and `2` to block with a message on
stderr. Registered per-agent under `hooks.preToolUse` in the agent JSON, invoked through Git
bash:

```json
{ "matcher": "shell", "command": "\"C:\\Program Files\\Git\\bin\\bash.exe\" .kiro/hooks/block-destructive.sh", "timeout_ms": 3000 }
```

`block-destructive.sh` blocks `reset --hard`, `clean -f`, force push, `branch -D`, recursive
deletes, writes into `content/` (that is the vault submodule — edits belong in the vault repo),
and `git submodule deinit`.

## Note on the vault's own `.kiro`

The vault repo has a separate, larger `.kiro` covering the note conventions, the audit and the
Windows/PowerShell pitfalls. It is excluded from publishing via `ignorePatterns` in
`quartz.config.yaml` — Quartz does not skip dot-folders automatically, only the ones listed.
