import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class ApiGateway extends Construct {
  public readonly api: apigateway.LambdaRestApi;
  constructor(scope: Construct, id: string, props: { handler: lambda.IFunction }) {
    super(scope, id);
    const restapi = new apigateway.LambdaRestApi(this, 'ApiGateway', {
      handler: props.handler,
      proxy: false,
    });
    this.api = restapi;
  }
}