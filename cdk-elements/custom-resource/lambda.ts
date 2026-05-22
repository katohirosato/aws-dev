import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface LambdaProps {
  vpc: ec2.IVpc;
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
      vpc: props.vpc,
      vpcSubnets: { subnets: props.vpc.privateSubnets },
    });
    this.lambdaFunction = lambdaFunction;
  }
}
