#!/bin/sh
set -ue

REPO_NAME="${1:-aws-dev}"
mkdir -p ${REPO_NAME}
cd ${REPO_NAME}
mkdir -p .aidlc/steering
mkdir -p .claude

# Fetch the latest AWS AIDLC rules from the aidlc-workflows repository
tempdir=$(mktemp -d)
git clone https://github.com/awslabs/aidlc-workflows.git "$tempdir/aidlc-workflows/"
echo tempdir: $tempdir
cp -R "$tempdir/aidlc-workflows/aidlc-rules/aws-aidlc-rules/" .aidlc/steering/
cp -R "$tempdir/aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/" .aidlc/
cp "$tempdir/aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md" .claude/CLAUDE.md
cp "$tempdir/aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md" .github/copilot-instructions.md
rm -rf "$tempdir"

# Initialize a new Git repository and make the first commit
if [ ! -d .git ]; then
    git init
    git branch -M main
fi
[ -z "$(git config user.name)" ] && git config --local user.name katohirosato
[ -z "$(git config user.email)" ] && git config --local user.email ****@gmail.com
git add .
git commit -m "first commit"
gh auth status > /dev/null 2>&1 || gh auth login --web --clipboard --git-protocol https
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
repo=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
gh repo edit "$repo" --template