---
name: lambda-role
description: AWS SDK を実行する Lambda 関数が必要とする IAM ロールを記述します。
---

## 引数

- `${LambdaDir}`: 対象のカスタムリソースのディレクトリパス（例: `lambda`）

## 背景

`${LambdaDir}/image/` は Lambda 関数が実行するコンテナイメージを構成するディレクトリです。Lambda 関数のハンドラーは AWS SDK (boto3) を使用して AWS リソースを操作するため、適切な IAM ポリシーを Lambda 実行ロールに付与する必要があります。

## 前提

- `${LambdaDir}/role.ts` には `aws-cdk-lib/aws-iam` を使用して Lambda 実行ロールが記述されます。
- マネージドポリシー `AWSLambdaVPCAccessExecutionRole` が予め与えられています。

## 手順

1. `${LambdaDir}/image/` を読み、boto3 クライアント/リソースの呼び出し（`client()`, `resource()` の引数サービス名、および呼び出しメソッド名）をすべて列挙します。
2. 各メソッド呼び出しを対応する IAM アクション（`service:Action` 形式）にマッピングします。最新の AWS ドキュメントや各 AWS API のリファレンスを参照して、正確なアクション名を特定してください。
3. その他にも必要な IAM アクションがあるかもしれません。
3. リソース ARN を可能な限り限定します。ワイルドカード (`*`) は対象リソースを特定できない場合のみ使用します。
4. `${LambdaDir}/role.ts` に `role.addToPolicy()` でインラインポリシーとして追加します。複数サービスにまたがる場合は `PolicyStatement` を分けてください。

## 出力形式

`${LambdaDir}/role.ts` に追加するコードは以下のパターンに従う:

```ts
role.addToPolicy(new iam.PolicyStatement({
  actions: ['service:Action'],
  resources: ['arn:aws:service:region:account-id:resource-type/resource-id'],
}));
```

リソース ARN が特定できない場合は次の形式に倣って可能な限り限定します。

```ts
cdk.Stack.of(this).formatArn({ service: '*', resource: '*', resourceName: '*' })
```

## 制約

- 必要最小限の権限のみ付与する（最小権限の原則）
- マネージドポリシーの追加は避け、インラインポリシーで個別アクションを指定する
- `${LambdaDir}/image/` のコードに存在しない API 呼び出しに対する権限は付与しない
- 条件キー（Condition）でさらに絞れる場合は積極的に使用する

## 推奨ツール(MCP)

- search_documentation (mcp:awslabs.aws-documentation-mcp-server): IAM アクション名やサービス認可リファレンスを検索する
- read_documentation (mcp:awslabs.aws-documentation-mcp-server): ドキュメントページ全体を取得する
- read_sections (mcp:awslabs.aws-documentation-mcp-server): ドキュメントページから特定セクションのみ抽出する


## 参考資料

- [AWS IAM ポリシーアクションリファレンス](https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html)
- [AWS SDK for Python (boto3) ドキュメント](https://docs.aws.amazon.com/boto3/latest/)
- [AWS CDK ドキュメント](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)