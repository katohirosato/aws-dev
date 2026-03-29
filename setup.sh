#!/bin/sh
set -ue

REPO_NAME="${1:-aws-app}"

gh auth status > /dev/null 2>&1 || gh auth login --web --clipboard --git-protocol https
gh repo create "$REPO_NAME" --private --template aws-template