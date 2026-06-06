# Custom Resource Template

AWS CDK でカスタムリソースを記述するためのテンプレート

## ディレクトリ構造

```text:tree
./
├── construct.ts      # Construct としてのエントリーポイント
├── cr.ts             # Custom Resource 定義
├── role.ts           # Lambda 関数が必要とする IAM ロール
└── image/            # Lambda 関数が実行するコンテナイメージ
    ├── Dockerfile
    ├── requirements.txt
    ├── app.py        # コンテナのエントリーポイント
    ├── create.py     # Create request ハンドラーもしくはそのエントリーポイント
    ├── update.py     # Update request ハンドラーもしくはそのエントリーポイント
    └── delete.py     # Delete request ハンドラーもしくはそのエントリーポイント
```

## `role.ts`

Lambda 関数に渡す IAM Role は、スキル `/.kiro/skills/lambda-role/` を使い、`role.ts` に記述します。

## Lambda Handlers

Lambda 関数のハンドラとして渡す Python スクリプトは、 `on_event_handler` と `is_complete_handler` の両方を含む必要があります。

```python
def on_event_handle(event,context)
    return { "PhysicalResourceId": '' }

def is_complete_handler(event, context):
    return {"IsComplete": True}
```

## class CustomResourceConstruct (Construct)

カスタムリソースとそのために必要なリソース一式を作成します。

### Example

```ts
declare const vpc: ec2.IVpc

import { CustomResourceConstruct } from './custom-resource/construct';

const resource = new CustomResourceConstruct(this, 'MyCustomResource', {
  vpc: vpc,
  resourceType?: 'Custom::MyResource',
  resourceProperties?: {
    key: value,
  }
});
```

### Construct Props

| Name | Type | Description |
| --- | --- | --- |
| `vpc` | `ec2.IVpc` | Custom Resource Provider を配置する VPC |
| `resourceProperties?` | `{[key:string]:any}` | Custom Resource Provider に渡す任意のオブジェクト |
| `resourceType?` | `string` | カスタムリソースのタイプ名（例: `Custom::MyResource`） |
