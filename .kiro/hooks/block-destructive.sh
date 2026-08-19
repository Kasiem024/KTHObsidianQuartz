#!/usr/bin/env bash
# preToolUse matcher: shell
#
# Blocks hard-to-undo operations in the site repo. Exit 2 = block.

INPUT=$(cat)

fail() {
  echo "BLOCKED: $1" >&2
  echo "If this is genuinely needed, do it yourself so it is a deliberate act." >&2
  exit 2
}

printf '%s' "$INPUT" | grep -qiE 'git[[:space:]]+reset[[:space:]]+--hard' && fail "git reset --hard discards work."
printf '%s' "$INPUT" | grep -qiE 'git[[:space:]]+clean[[:space:]]+-[a-zA-Z]*f' && fail "git clean -f deletes untracked files."
printf '%s' "$INPUT" | grep -qiE 'git[[:space:]]+push[^|]*(--force|-f\b)' && fail "force push rewrites published history."
printf '%s' "$INPUT" | grep -qiE 'git[[:space:]]+branch[[:space:]]+-D' && fail "git branch -D force-deletes an unmerged branch. Use -d, and prune first if it refuses."
printf '%s' "$INPUT" | grep -qiE 'Remove-Item[^|]*-Recurse' && fail "recursive delete."
printf '%s' "$INPUT" | grep -qiE '\brm[[:space:]]+(-[a-zA-Z]*[rf][a-zA-Z]*[[:space:]]+)+' && fail "recursive/forced rm."

# content/ is the vault submodule. Edits belong in the vault repo, which has its own standard.
printf '%s' "$INPUT" | grep -qiE '(Set-Content|WriteAllText|Out-File|>[[:space:]]*)[^|]*content[\\/]' && fail "content/ is the vault submodule - edit the vault repo instead."

# Deleting the submodule pointer or reinitialising it loses the content mount.
printf '%s' "$INPUT" | grep -qiE 'git[[:space:]]+submodule[[:space:]]+deinit' && fail "deinitialising the content submodule would unmount the vault."

exit 0
