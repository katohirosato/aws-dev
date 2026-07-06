#!/bin/bash
devcontainer templates apply \
  --template-id ghcr.io/katohirosato/aws-dev/aws-dev \
  --omit-paths '[
    ".git/*",
    ".gitignore",
    ".github/workflows/template.yaml",
    ".devcontainer/config",
    ".devcontainer/.env",
    "devcontainer-template.json",
    "history.sh",
    "startup.sh",
    "README.md",
    "cdk-elements/*"
  ]';
git config --global user.name katohirosato
git config --global user.email hirosato654@gmail.com