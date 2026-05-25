import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

interface CustomResourceProps {
  vpc: ec2.IVpc;
  repository: ecr.IRepository;
  role: iam.IRole;
  resourceProperties: {[key: string]: any};
  resourceType?: string;
}

export class CustomResource extends Construct{
  public readonly customresource: cdk.CustomResource;
  constructor(scope: Construct, id: string, props: CustomResourceProps) {
    super(scope, id);
    const onEventHandler = new lambda.DockerImageFunction(this, 'EventHandler', {
      code: lambda.DockerImageCode.fromEcr(props.repository, {cmd: ['app.on_event_handler']}),
      role: props.role,
      timeout: cdk.Duration.seconds(900),
      vpc: props.vpc,
      vpcSubnets: { subnets: props.vpc.privateSubnets },
    });
    const isCompleteHandler = new lambda.DockerImageFunction(this, 'IsCompleteHandler', {
      code: lambda.DockerImageCode.fromEcr(props.repository, {cmd: ['app.is_complete_handler']}),
      role: props.role,
      timeout: cdk.Duration.seconds(900),
      vpc: props.vpc,
      vpcSubnets: { subnets: props.vpc.privateSubnets },
    });
    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: onEventHandler,
      isCompleteHandler: isCompleteHandler,
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