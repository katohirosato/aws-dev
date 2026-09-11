#!/bin/bash
npm install --global @devcontainers/cli;
npm install --global aws-cdk;
pip install boto3[crt];
uv python install 3.10;
curl -fsSL https://cli.kiro.dev/install | bash;

curl -fsSL https://github.com/awslabs/aidlc-workflows/releases/latest/download/install.sh | sh;

aidlc config --harness kiro

mkdir -p ~/.kiro/skills
aws configure agent-toolkit --yes --region us-east-1;
