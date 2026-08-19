#!/usr/bin/env bash
# preToolUse matcher: write, shell
#
# This repository is public. Blocks writing or committing key material and obvious
# credential patterns. Deployment uses the workflow's built-in GITHUB_TOKEN, so no secret
# ever needs to exist in the tree.
#
# Exit 2 = block.

INPUT=$(cat)

if printf '%s' "$INPUT" | grep -qiE '\.env([."'"'"' /\\]|$)|\.pem([."'"'"' ]|$)|\.p12([."'"'"' ]|$)|\.pfx([."'"'"' ]|$)|id_rsa|id_ed25519|credentials\.json|\.netrc'; then
  echo "BLOCKED: this targets secret or key material, and this repository is public." >&2
  echo "Deployment uses the workflow's GITHUB_TOKEN; nothing secret belongs in the tree." >&2
  exit 2
fi

if printf '%s' "$INPUT" | grep -qE '(ghp_|github_pat_)[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----'; then
  echo "BLOCKED: this looks like a real credential (GitHub token, AWS key, or private key)." >&2
  echo "The repository is public. Do not commit it; rotate it if it has been exposed." >&2
  exit 2
fi

exit 0
