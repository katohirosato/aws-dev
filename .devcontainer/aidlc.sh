#!/bin/bash

uv python install 3.10;
curl -fsSL https://cli.kiro.dev/install | bash;
aws configure agent-toolkit --yes --region us-east-1;

cd ~;
git clone https://github.com/awslabs/aidlc-workflows.git;
cp -R ~/aidlc-workflows/aws-aidlc-rule-details .aidlc/aidlc-rules/;
cp ~/aidlc-workflows/aws-aidlc-rules/core-workflow.md .kiro/steering/core-workflow.md;
cp ~/aidlc-workflows/aws-aidlc-rules/core-workflow.md .claude/CLAUDE.md;
cp ~/aidlc-workflows/aws-aidlc-rules/core-workflow.md .github/copilot-instructions.md;
