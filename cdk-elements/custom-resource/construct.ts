import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { CustomResource } from './cr';
import { Repository } from './repository';
import { Role } from './role';
import { Lambda } from './lambda';

export interface CustomResourceProps {
  vpc: ec2.IVpc;
  resourceType?: string;
}

export class CustomResourceConstruct extends Construct {
  public readonly customresource: cr.CustomResource;
  constructor(scope: Construct, id: string, props: CustomResourceProps) {
    super(scope, id);
    const repository = new Repository(this, 'Repository');
    const role = new Role(this, 'Role');
    const lambda = new Lambda(this, 'Lambda', {
      repository: repository.repository,
      role: role.role,
    });
    const customresource = new CustomResource(this, 'CustomResource', {
      vpc: props.vpc,
      handler: lambda.lambdaFunction,
      resourceType: props.resourceType,
    });
    this.customresource = customresource;
  }
}