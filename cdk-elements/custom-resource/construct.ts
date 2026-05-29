import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Repository } from './repository';
import { Role } from './role';
import { CustomResource } from './cr';

export interface CustomResourceConstructProps {
  vpc: ec2.IVpc;
  resourceProperties: {[key: string]: any};
  resourceType?: string;
}

export class CustomResourceConstruct extends Construct {
  public readonly resource: cdk.CustomResource;
  constructor(scope: Construct, id: string, props: CustomResourceConstructProps) {
    super(scope, id);
    const repository = new Repository(this, 'Repository');
    // リポジトリにイメージがまだ存在しない場合は以下をコメントアウト
    const logGroup = new cdk.aws_logs.LogGroup(this, 'LogGroup', {
      logGroupName: `/${this.node.root}/${this.node.path}/LogGroup`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const role = new Role(this, 'Role');
    const cr = new CustomResource(this, 'CustomResource', {
      vpc: props.vpc,
      repository: repository.repository,
      logGroup: logGroup,
      role: role.role,
      resourceProperties: props.resourceProperties,
      resourceType: props.resourceType,
    });
    this.resource = cr.cr;
  }
}
