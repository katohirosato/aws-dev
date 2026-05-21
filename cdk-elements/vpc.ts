import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class Vpc extends Construct {
  public readonly vpc: ec2.IVpc;
  constructor(scope: Construct, id: string, props: ec2.VpcProps) {
    super(scope, id);
    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: props.maxAzs,
      natGateways: props.natGateways, 
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'PrivateSubnet',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 24,
          name: 'IsolatedSubnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        }
      ]
    });
    this.vpc = vpc;
  }
}