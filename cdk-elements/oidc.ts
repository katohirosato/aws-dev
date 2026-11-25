import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';

const ISSUER = 'token.actions.githubusercontent.com';

export interface GithubOidcProps {
  /** 信頼する GitHub リポジトリ。`owner/repo` 形式。 */
  readonly repository: string;
}

/** GitHub Actions が AssumeRoleWithWebIdentity するための OIDC プロバイダーとロール。 */
export class GithubOidc extends Construct {
  readonly provider: iam.IOidcProvider;
  readonly role: iam.IRole;
  constructor(scope: Construct, id: string, props: GithubOidcProps) {
    super(scope, id);
    this.provider = new iam.OidcProviderNative(this, 'Provider', {
      url: `https://${ISSUER}`,
      clientIds: ['sts.amazonaws.com'],
    });
    this.role = new iam.Role(this, 'Role', {
      description: `Assumed by GitHub Actions in ${props.repository}`,
      maxSessionDuration: cdk.Duration.hours(1),
      assumedBy: new iam.WebIdentityPrincipal(this.provider.oidcProviderArn, {
        StringEquals: { [`${ISSUER}:aud`]: 'sts.amazonaws.com' },
        StringLike: { [`${ISSUER}:sub`]: `repo:${props.repository}:*` },
      }),
      inlinePolicies: {
        GitHubActionsPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ['sts:AssumeRole'],
              resources: [`arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:role/cdk-*`],
            }),
          ],
        }),
      }
    });
  }
}
