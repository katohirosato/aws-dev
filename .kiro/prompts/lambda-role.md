---
name: lambda-role
description: AWS SDK を実行する Lambda 関数が必要とする IAM ロールを記述します。
---

# Lambda 関数実行ロールの記述

AWS SDK を実行する Lambda 関数が必要とする IAM ロールを記述します。

## 引数

- `${LambdaDir}`: 対象のディレクトリパス（例: `lambda`）

## 背景

`${LambdaDir}/image/` は Lambda 関数が実行するコンテナイメージを構成するディレクトリです。Lambda 関数のハンドラーは boto3 を使用して AWS リソースを操作するため、適切な IAM ポリシーを Lambda 実行ロールに付与する必要があります。

```typescript:lambda.ts
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Role } from './role';

const lambdaFunction = new lambda.Function(this, 'Lambda', {
  role: Role.role,
})
```

## 前提

- Lambda 関数は Python (boto3) で実装されています。
- `${LambdaDir}/role.ts` には `aws-cdk-lib/aws-iam` を使用して Lambda 実行ロールが記述されます。
- マネージドポリシー `AWSLambdaVPCAccessExecutionRole` が予め与えられています。
- 既存のポリシーステートメントは保持し、不足分のみ追加します。

## 手順

1. `${LambdaDir}/image/` を読み、boto3 クライアント/リソースの呼び出し（`client()`, `resource()` の引数サービス名、および呼び出しメソッド名）をすべて列挙します。
2. 各メソッド呼び出しを対応する IAM アクション（`service:Action` 形式）にマッピングします。最新の AWS ドキュメントや各 AWS API のリファレンスを参照して、正確なアクション名を特定してください。
3. 暗黙的に必要なアクションも検討します（例: KMS 暗号化が有効なリソースへのアクセスに必要な `kms:Decrypt`/`kms:GenerateDataKey`、S3 暗号化バケットへの書き込みに必要な KMS 権限など）。
4. リソース ARN を可能な限り限定します。ワイルドカード (`*`) は対象リソースを特定できない場合のみ使用します。
5. `${LambdaDir}/role.ts` に `role.addToPolicy()` でインラインポリシーとして追加します。複数サービスにまたがる場合は `PolicyStatement` を分けてください。

## 出力形式

`${LambdaDir}/role.ts` に追加するコードは次のパターンに従います。

```typescript:role.ts
const role = new iam.Role(...)
role.addToPolicy(new iam.PolicyStatement({
  actions: ['service:Action'],
  resources: ['arn:aws:service:region:account-id:resource-type/resource-id'],
}));
```

リソース ARN が特定できない場合は次の形式に倣って可能な限り限定します。

```typescript:role.ts
cdk.Stack.of(this).formatArn({ service: 's3', resource: 'my-bucket', resourceName: '*' })
```

## 制約

- 必要最小限の権限のみ付与する（最小権限の原則）
- `${LambdaDir}/image/` のコードに存在しない API 呼び出しに対する権限は付与しない
- 条件キー（Condition）でさらに絞れる場合は積極的に使用する
- 要件に近いマネージドポリシーを積極的に検索し、必要なアクションの80%以上をカバーし不要なアクションが全体の20%以下であれば提案する。過不足を説明したうえで判断を求める。

## エラーハンドリング

- `${LambdaDir}/image/` ディレクトリが存在しない場合はエラーとしてユーザーに報告する。
- boto3 の呼び出しが1つも検出されない場合はユーザーに確認を求める（ファイルパスの誤り、または本当に AWS API を呼んでいない可能性）。
- IAM アクション名が特定できない boto3 メソッドがある場合は、該当メソッドを明示してユーザーに判断を求める。

## 推奨ツール(MCP)

- search_documentation (mcp:awslabs.aws-documentation-mcp-server): IAM アクション名やサービス認可リファレンスを検索する
- read_documentation (mcp:awslabs.aws-documentation-mcp-server): ドキュメントページ全体を取得する
- read_sections (mcp:awslabs.aws-documentation-mcp-server): ドキュメントページから特定セクションのみ抽出する

## 参考資料

- [AWS IAM ポリシーアクションリファレンス](https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html)
- [AWS SDK for Python (boto3) ドキュメント](https://docs.aws.amazon.com/boto3/latest/)
- [AWS CDK ドキュメント](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)
