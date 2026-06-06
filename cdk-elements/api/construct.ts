import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Lambda } from './lambda';
import { Role } from './role';
import { ApiGateway } from './apigateway';

export class ApiConstruct extends Construct {
  public readonly api: apigateway.LambdaRestApi;
  constructor(scope: Construct, id: string, props: { vpc: ec2.IVpc }) {
    super(scope, id);
    const role = new Role(this, 'Role');
    const lambda = new Lambda(this, 'Lambda', { vpc: props.vpc, role: role.role, imageDir: 'lib/api/image/' });
    const api = new ApiGateway(this, 'ApiGateway', { handler: lambda.lambdaFunction });
    this.api = api.api;
  }
}