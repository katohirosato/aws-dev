#!/bin/bash
npm install --global @devcontainers/cli;
npm install --global aws-cdk;
pip install boto3[crt];
uv python install 3.10;
curl -fsSL https://cli.kiro.dev/install | bash;
aws configure agent-toolkit --yes --region us-east-1;

mkdir -p ~/.aidlc/aidlc-rules/;
mkdir -p ~/.kiro/steering/; 
mkdir -p ~/.claude/;
mkdir -p ~/.github/;
git clone https://github.com/awslabs/aidlc-workflows.git ~/aidlc-workflows;
cp -R ~/aidlc-workflows/aidlc-rules/aws-aidlc-rule-details/ ~/.aidlc/aidlc-rules/;
cp ~/aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md ~/.kiro/steering/core-workflow.md;
cp ~/aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md ~/.claude/CLAUDE.md;
cp ~/aidlc-workflows/aidlc-rules/aws-aidlc-rules/core-workflow.md ~/.github/copilot-instructions.md;
