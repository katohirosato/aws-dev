import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Lambda } from './lambda';
import { Role } from './role';
import { ApiGateway } from './apigateway';

export class StreamingUrl extends Construct {
  public readonly url: string;
  constructor(scope: Construct, id: string, props: { vpc: ec2.IVpc }) {
    super(scope, id);
    const role = new Role(this, 'Role');
    const lambda = new Lambda(this, 'Lambda', { vpc: props.vpc, role: role.role, imageDir: 'lib/api/image/' });
    const api = new ApiGateway(this, 'ApiGateway', { handler: lambda.lambdaFunction });
    this.url = api.api.url + 'workspaces-prototype/streaming-url';
  }
}