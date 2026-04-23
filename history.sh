#!/bin/sh
set -ue

REPO_NAME="${1:-aws-dev}"

git clone https://github.com/awslabs/aidlc-workflows.git
cp -R aidlc-workflows/aidlc-rules/aws-aidlc-rules .kiro/steering/
cp -R aidlc-workflows/aidlc-rules/aws-aidlc-rules-details .kiro/
rm -rf aidlc-workflows

if [ ! -d .git ]; then
    git init
    git branch -M main
fi
[ -z "$(git config user.name)" ] && git config --local user.name "Your Name"
[ -z "$(git config user.email)" ] && git config --local user.email "your.email@example.com"
git add .
git commit -m "first commit"
gh auth status > /dev/null 2>&1 || gh auth login --web --clipboard --git-protocol https
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
repo=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
gh repo edit "$repo" --template