#!/bin/sh

RegistryUri=${1}
RepositoryName=${2}
RepositoryUri=${3}

aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${RegistryUri}
docker build -t ${RepositoryName} .
docker tag ${RepositoryName}:latest ${RepositoryUri}:latest
docker push ${RepositoryUri}:latest