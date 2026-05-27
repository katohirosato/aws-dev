import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class Repository extends Construct {
  public readonly repository: ecr.IRepository;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const repository = new ecr.Repository(this, 'Repository', {
      emptyOnDelete: true,
      imageScanOnPush: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [
        {
          maxImageCount: 4,
        },
      ]
    });
    new cdk.CfnOutput(this, 'RegistryUri', {
      value: repository.registryUri,
      key: 'RegistryUri',
    });
    new cdk.CfnOutput(this, 'RepositoryName', {
      value: repository.repositoryName,
      key: 'RepositoryName',
    });
    new cdk.CfnOutput(this, 'RepositoryUrl', {
      value: repository.repositoryUri,
      key: 'RepositoryUrl',
    });
  }
}