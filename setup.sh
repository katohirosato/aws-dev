#!/bin/bash
REPONAME=${1:-aws-app}
mkdir -p ${REPONAME}
cd ${REPONAME}
curl -L -o .devcontainer.json https://raw.githubusercontent.com/katohirosato/aws-dev/main/.devcontainer.json
# > Dev Container: Rebuild and Reopen in Container as .devcontainer.json
git init
git branch -M main
git remote add origin https://github.com/<repo-owner>/${REPONAME}.git
git config user.name "<Your Name>"
git config user.email "<your.email@example.com>"
git add .
git commit -m "first commit"
git push -u origin main
# > Dev Container: Reopen in WSL
# > Dev Container: Rebuild and Reopen in Container as .devcontainer/devcontainer.json
aws configure sso
aws sso login