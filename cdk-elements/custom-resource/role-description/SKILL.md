---
name: role-description
description: AWS SDK を実行する Lambda 関数が必要とする IAM ロールを記述します。
---

## 背景

`image/` は Lambda 関数が実行するコンテナイメージを構成するディレクトリで、関数のハンドラーは Python で記述されます。関数は AWS SDK (boto3) を使用して AWS リソースを操作するため、適切な IAM ポリシーを Lambda 実行ロールに付与する必要があります。
このスキルでは、`image/` 内の Python ハンドラーが使用する AWS SDK 呼び出しを分析し、必要な IAM ポリシーを `role.ts` に記述する方法を説明します。

## 前提

- `role.ts` は `aws-cdk-lib/aws-iam` を使用して Lambda 実行ロールを定義する
- ベースとして `AWSLambdaBasicExecutionRole`（CloudWatch Logs 書き込み）が付与済み
- VPC 内で実行する場合は `AWSLambdaVPCAccessExecutionRole` も必要になる場合がある

## 手順

1. `image/create.py`, `image/update.py`, `image/delete.py` を読み、boto3 クライアント/リソースの呼び出し（`client()`, `resource()` の引数サービス名、および呼び出しメソッド名）をすべて列挙する
2. 各メソッド呼び出しを対応する IAM アクション（`service:Action` 形式）にマッピングする
3. リソース ARN を可能な限り限定する。ワイルドカード (`*`) は対象リソースを特定できない場合のみ使用する
4. `role.ts` に `role.addToPolicy()` でインラインポリシーとして追加する。複数サービスにまたがる場合は `PolicyStatement` を分ける

## 出力形式

`role.ts` に追加するコードは以下のパターンに従う:

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
