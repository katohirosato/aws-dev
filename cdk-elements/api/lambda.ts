import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';

export class Lambda extends Construct {
  public readonly lambdaFunction: lambda.IFunction;
  constructor(scope: Construct, id: string, props: { role: iam.IRole, imageDir: string }) {
    super(scope, id);
    // Lambda 関数
    const lambdaFunction = new lambda.DockerImageFunction(this, 'Lambda', {
      code: lambda.DockerImageCode.fromImageAsset(props.imageDir),
      role: props.role,
      timeout: cdk.Duration.seconds(900),
    });
    this.lambdaFunction = lambdaFunction;
  }
}