import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as logs from 'aws-cdk-lib/aws-logs';

interface CustomResourceProps {
  vpc: ec2.IVpc;
  role: iam.IRole;
  repository: ecr.IRepository;
  logGroup: logs.ILogGroup;
  resourceProperties: {[key: string]: any};
  resourceType?: string;
}

export class CustomResource extends Construct{
  public readonly cr: cdk.CustomResource;
  constructor(scope: Construct, id: string, props: CustomResourceProps) {
    super(scope, id);
    const onEventHandler = new lambda.DockerImageFunction(this, 'EventHandler', {
      code: lambda.DockerImageCode.fromImageAsset('lib/s3-file-gateway/image/', {cmd: ['app.on_event_handler']}),
      role: props.role,
      logGroup: props.logGroup,
      timeout: cdk.Duration.seconds(900),
      vpc: props.vpc,
      vpcSubnets: { subnets: props.vpc.isolatedSubnets },
    });
    const isCompleteHandler = new lambda.DockerImageFunction(this, 'IsCompleteHandler', {
      code: lambda.DockerImageCode.fromImageAsset('lib/s3-file-gateway/image/', {cmd: ['app.is_complete_handler']}),
      role: props.role,
      logGroup: props.logGroup,
      timeout: cdk.Duration.seconds(900),
      vpc: props.vpc,
      vpcSubnets: { subnets: props.vpc.isolatedSubnets },
    });
    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: onEventHandler,
      isCompleteHandler: isCompleteHandler,
      logGroup: props.logGroup,
      vpc: props.vpc,
      vpcSubnets: { subnets: props.vpc.isolatedSubnets },
      queryInterval: cdk.Duration.minutes(5),
      totalTimeout: cdk.Duration.hours(1),
    });
    const resource = new cdk.CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      resourceType: props.resourceType,
      properties: props.resourceProperties,
    });
    this.cr = resource;
  }
} 