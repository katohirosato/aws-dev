# Custom Resource Template

AWS CDK で API Gateway を記述するためのテンプレート

## ディレクトリ構造

```text:tree
./
├── construct.ts      # Construct としてのエントリーポイント
├── lambda.ts         # Lambda 関数
├── apigateway.ts     # API Gateway
├── role.ts           # Lambda 関数が必要とする IAM ロール
└── image/            # Lambda 関数が実行するコンテナイメージ
    ├── Dockerfile
    ├── requirements.txt
    └── app.py        # コンテナのエントリーポイント
```

## `role.ts`

Lambda 関数に渡す IAM Role は、スキル `/.kiro/skills/lambda-role/` を使い、`role.ts` に記述します。

## class ApiConstruct (Construct)

API Gateway とそのために必要なリソース一式を作成します。

### Example

```ts
declare const vpc: ec2.IVpc

import { ApiConstruct } from './api/construct';

const api = new ApiConstruct(this, 'Api', {
  vpc: vpc,
  resource?: string, 
  methods?: string[]
});
```

### Construct Props

| Name | Type | Default | Description |
| --- | --- | --- |
| `vpc` | `ec2.IVpc` | | Lambda 関数を配置する VPC |
| `resource?` | `string` | `'/'` |  API のパス |
| `methods?` | `string[]` | `['GET']` | API メソッドのリスト |
