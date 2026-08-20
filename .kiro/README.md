# .kiro — agent context for the site repo

Context for AI agents working on the Quartz site. Modelled on the `.kiro` layout used in
`Kana-App`, trimmed to what a static-site repo needs.

| Path | Purpose |
|---|---|
| `steering/product.md` | What the site is, how publishing works |
| `steering/conventions.md` | Hard rules, traps, and what has already been ruled out |
| `traps.md` | The eight things that fail **silently** while the build exits 0 |
| `lessons-learned.md` | Where a miss becomes a new check |
| `skills/verify-the-site/` | How to build and verify — the submodule trap, `check-site.mjs`, the baseline |
| `settings/lsp.json` | TypeScript language server, for symbol navigation over `quartz.ts`, the plugin and `tools/` |
| `hooks/*.sh` | `preToolUse` guards — read stdin, `exit 2` blocks |
| `agents/site-builder.*` | Builds and verifies the output |

See also `MANUAL-CHECK.md` in the repo root: the checks no script here can make, ordered so
Priority 1 takes about ten minutes.

## Steering vs. skills

`steering/` is loaded automatically and says how to work here. `skills/` is loaded on demand
and gives step-by-step procedures, so the detail costs nothing until it is relevant. Skills
are auto-discovered, which is why "make the agent know about X" is a skill rather than a new
agent.

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
deletes, **shell commands** that write into `content/` (that is the vault submodule — edits
belong in the vault repo), and `git submodule deinit`. `block-secrets.sh` blocks key material
and credential patterns, since this repository is public and deployment uses the workflow's
built-in `GITHUB_TOKEN`.

Note the precise scope: both hooks are registered for the `shell` matcher, so they inspect
commands, not tool payloads. `site-builder` cannot edit files at all — its `tools` list is
`read, grep, glob, shell` with no `write`, and that tool restriction, not the hook, is the
hard guarantee.

## Note on the vault's own `.kiro`

The vault repo has a separate, larger `.kiro` covering the note conventions, the audit and the
Windows/PowerShell pitfalls. It is excluded from publishing via `ignorePatterns` in
`quartz.config.yaml` — Quartz does not skip dot-folders automatically, only the ones listed.
