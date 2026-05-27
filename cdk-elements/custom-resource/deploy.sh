#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

RegistryUri=${1}
RepositoryName=${2}
RepositoryUri=${3}

aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${RegistryUri}
docker build -t ${RepositoryName} ${SCRIPT_DIR}/image
docker tag ${RepositoryName}:latest ${RepositoryUri}:latest
docker push ${RepositoryUri}:latest