import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export interface ResourceProperties {}

interface CustomResourceProps {
  vpc: ec2.IVpc;
  repository: ecr.IRepository;
  role: iam.IRole;
  resourceProperties: ResourceProperties;
  resourceType?: string;
}

export class CustomResource extends Construct{
  public readonly customresource: cdk.CustomResource;
  constructor(scope: Construct, id: string, props: CustomResourceProps) {
    super(scope, id);
    const handler = new lambda.DockerImageFunction(this, 'LambdaFunction', {
      code: lambda.DockerImageCode.fromEcr(props.repository),
      role: props.role,
      timeout: cdk.Duration.seconds(900),
      vpc: props.vpc,
      vpcSubnets: { subnets: props.vpc.privateSubnets },
    });
    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: handler,
      vpc: props.vpc,
      vpcSubnets: { subnets: props.vpc.privateSubnets },
    });
    const resource = new cdk.CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      resourceType: props.resourceType,
      properties: props.resourceProperties,
    });
    this.customresource = resource;
  }
} 