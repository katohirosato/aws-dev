# Custom Resource Template

AWS CDK でカスタムリソースを記述するためのテンプレート

## ディレクトリ構造

```text:tree
./
├── construct.ts      # Construct としてのエントリーポイント
├── cr.ts             # Custom Resource 定義
├── role.ts           # Lambda 関数が必要とする IAM ロール
├── repository.ts     # Lambda 関数が実行するコンテナイメージのためのリポジトリ
└── image/            # Lambda 関数が実行するコンテナイメージ
    ├── Dockerfile
    ├── requirements.txt
    ├── app.py        # コンテナのエントリーポイント
    ├── create.py     # Create request ハンドラーもしくはそのエントリーポイント
    ├── update.py     # Update request ハンドラーもしくはそのエントリーポイント
    └── delete.py     # Delete request ハンドラーもしくはそのエントリーポイント
```

## class CustomResourceConstruct (Construct)

カスタムリソースとそのために必要なリソース一式を作成します。

### Example

```ts
declare const vpc: ec2.IVpc

import { CustomResourceConstruct } from './custom-resource/construct';

const resource = new CustomResourceConstruct(this, 'MyCustomResource', {
  vpc: vpc,
  resourceType: 'Custom::MyResource',
  resourceProperties: {
    key: value,
  }
});
```

```python
def handler(event,context)
    value = event['ResourceProperties']['key']
```

### Construct Props

| Name | Type | Description |
| --- | --- | --- |
| `vpc` | `ec2.IVpc` | Custom Resource Provider を配置する VPC |
| `resourceProperties` | `{[key:string]:any}` | Custom Resource Provider に渡す任意のオブジェクト |
| `resourceType?` | `string` | カスタムリソースのタイプ名（例: `Custom::MyResource`） |
