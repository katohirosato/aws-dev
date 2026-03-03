#!/bin/bash
curl -L -o .devcontainer.json https://raw.githubusercontent.com/katohirosato/aws-dev/main/.devcontainer.json
REPONAME=$(basename $(git rev-parse --show-toplevel))
git init
git branch -M main
git remote add origin https://github.com/<repo-owner>/${REPONAME}.git
git config user.name "<Your Name>"
git config user.email "<your.email@example.com>"
# > Dev Container: Rebuild and Reopen in Container as .devcontainer.json
git add .
git commit -m "first commit"
git push -u origin main

# > Dev Container: Rebuild and Reopen in Container as .devcontainer/devcontainer.json