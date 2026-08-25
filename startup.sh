#!/bin/sh
# usage: ./startup.sh [repo]
set -ue

REPO="${1:-aws-app}"
REPO_DIR="${REPO##*/}"
TEMPLATE_REPO="katohirosato/aws-dev"

gh auth status > /dev/null 2>&1 || gh auth login --web --clipboard --git-protocol https
gh repo clone "$TEMPLATE_REPO" "$REPO_DIR" -- --depth 1

cd "$REPO_DIR"
rm -rf .git/ README.md .github/workflows/template.yaml devcontainer-template.json history.sh startup.sh
git init -b main
git add .
git commit -m "first commit"
gh repo create "$REPO" --private --source=. --remote=origin --push
cd ..
rm -rf "$REPO_DIR"
