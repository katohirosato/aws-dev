import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Repository } from './repository';
import { Lambda } from './lambda';
import { Role } from './role';
import { ApiGateway } from './apigateway';

export class StreamingUrl extends Construct {
  public readonly url: string;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const role = new Role(this, 'Role');
    const lambda = new Lambda(this, 'Lambda', { role: role.role, imageDir: 'lib/api/image/' });
    const api = new ApiGateway(this, 'ApiGateway', { handler: lambda.lambdaFunction });
    this.url = api.api.url + 'workspaces-prototype/streaming-url';
  }
}