---
name: role-description
description: AWS SDK を実行する Lambda 関数が必要とする IAM ロールを記述します。
---

## 引数

- `${CustomResourcePlase}`: 対象のカスタムリソースのディレクトリパス（例: `custom-resource`）

## 背景

`${CustomResourcePlase}/image/` は Lambda 関数が実行するコンテナイメージを構成するディレクトリで、関数のハンドラーは Python で記述されます。関数は AWS SDK (boto3) を使用して AWS リソースを操作するため、適切な IAM ポリシーを Lambda 実行ロールに付与する必要があります。
このスキルでは、`${CustomResourcePlase}/image/` 内の Python ハンドラーが使用する AWS SDK 呼び出しを分析し、必要な IAM ポリシーを `${CustomResourcePlase}/role.ts` に記述する方法を説明します。

## 前提

- `${CustomResourcePlase}/role.ts` は `aws-cdk-lib/aws-iam` を使用して Lambda 実行ロールを定義する
- ベースとして `AWSLambdaVPCAccessExecutionRole`（CloudWatch Logs 書き込み）が付与済み

## 手順

1. `${CustomResourcePlase}/image/` を読み、boto3 クライアント/リソースの呼び出し（`client()`, `resource()` の引数サービス名、および呼び出しメソッド名）をすべて列挙する
2. 各メソッド呼び出しを対応する IAM アクション（`service:Action` 形式）にマッピングする
3. リソース ARN を可能な限り限定する。ワイルドカード (`*`) は対象リソースを特定できない場合のみ使用する
4. `${CustomResourcePlase}/role.ts` に `role.addToPolicy()` でインラインポリシーとして追加する。複数サービスにまたがる場合は `PolicyStatement` を分ける

## 出力形式

`${CustomResourcePlase}/role.ts` に追加するコードは以下のパターンに従う:

```ts
role.addToPolicy(new iam.PolicyStatement({
  actions: ['service:Action'],
  resources: ['arn:aws:service:*:*:resource'],
}));
```

## 制約

- 必要最小限の権限のみ付与する（最小権限の原則）
- マネージドポリシーの追加は避け、インラインポリシーで個別アクションを指定する
- `image/` のコードに存在しない API 呼び出しに対する権限は付与しない
- 条件キー（Condition）でさらに絞れる場合は積極的に使用する
