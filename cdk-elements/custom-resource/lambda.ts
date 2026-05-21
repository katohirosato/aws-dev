import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';

export interface LambdaProps {
  repository: ecr.IRepository;
  role: iam.IRole;
}

export class Lambda extends Construct {
  public readonly lambdaFunction: lambda.IFunction;
  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);
    // Lambda 関数
    const lambdaFunction = new lambda.DockerImageFunction(this, 'Function', {
      code: lambda.DockerImageCode.fromEcr(props.repository),
      role: props.role,
      timeout: cdk.Duration.seconds(900),
    });
    this.lambdaFunction = lambdaFunction;
  }
}
