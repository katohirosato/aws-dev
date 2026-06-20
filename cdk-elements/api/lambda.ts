import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';

export class Lambda extends Construct {
  public readonly lambdaFunction: lambda.IFunction;
  constructor(scope: Construct, id: string, props: { vpc: ec2.IVpc, role: iam.IRole, imageDir: string, logGroup: logs.ILogGroup }) {
    super(scope, id);
    const lambdaFunction = new lambda.DockerImageFunction(this, 'Lambda', {
      code: lambda.DockerImageCode.fromImageAsset(props.imageDir),
      role: props.role,
      logGroup: props.logGroup,
      timeout: cdk.Duration.seconds(900),
      vpc: props.vpc,
      vpcSubnets: { subnets: props.vpc.isolatedSubnets },
    });
    this.lambdaFunction = lambdaFunction;
  }
}