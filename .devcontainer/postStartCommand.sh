#!/bin/bash
devcontainer templates apply --template-id ghcr.io/katohirosato/aws-dev/aws-dev --omit-paths '[".git/*","README.md",".github/workflows/template.yaml","devcontainer-template.json","history.sh", "startup.sh", ".devcontainer/config", ".devcontainer/.env"]';
git config --global user.name katohirosato
git config --global user.email hirosato654@gmail.com