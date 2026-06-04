import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class Role extends Construct {
  public readonly role: iam.IRole;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'));
    // Add additional policies based on the boto3 calls in the Lambda handler
    this.role = role;
  }
}