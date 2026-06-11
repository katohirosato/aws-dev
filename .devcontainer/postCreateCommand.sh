#!/bin/bash
npm install -g @devcontainers/cli
npm install --global aws-cdk;
pip install boto3[crt];
uv python install 3.10;
curl -fsSL https://cli.kiro.dev/install | bash;
