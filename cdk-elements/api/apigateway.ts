import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class ApiGateway extends Construct {
  public readonly api: apigateway.LambdaRestApi;
  constructor(scope: Construct, id: string, props: { handler: lambda.IFunction, resource?: string, methods?: string[] }) {
    super(scope, id);
    const restapi = new apigateway.LambdaRestApi(this, 'ApiGateway', {
      handler: props.handler,
      proxy: false,
    });
    let resource = restapi.root;
    if (props.resource) {
      for (const res of props.resource.split('/')) {
        resource = resource.addResource(res);
      }
    }
    const methods = props.methods || ['GET'];
    for (const method of methods) {
      resource.addMethod(method);
    }
    this.api = restapi;
    new cdk.CfnOutput(this, 'ApiUrl', { value: restapi.url + (props.resource ? props.resource : '') });
  }
}
