import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export interface CustomResourceProps {
  vpc: ec2.IVpc;
  handler: lambda.IFunction;
  resourceType?: string;
}

export class CustomResource extends Construct{
  public readonly customresource: cr.CustomResource;
  constructor(scope: Construct, id: string, props: CustomResourceProps) {
    super(scope, id);
    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: props.handler,
      vpc: props.vpc,
      vpcSubnets: { subnets: props.vpc.privateSubnets },
    });
    const resource = new cdk.CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      resourceType: props.resourceType,
    });
    this.customresource = resource;
  }
} 