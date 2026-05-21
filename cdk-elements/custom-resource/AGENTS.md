# Custom Resource Template

AWS CDK でカスタムリソースを記述するためのテンプレート

## ディレクトリ構造

```
custom-resource/
├── construct.ts      # Construct としてのエントリーポイント
├── cr.ts             # Custom Resource
├── role.ts           # Lambda 関数が必要とする IAM ロール
├── lambda.ts         # Custom Resource Provider としての Lambda 関数
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

ECR リポジトリ、IAM ロール、Docker イメージ Lambda、および CloudFormation カスタムリソースを一括で作成する Construct。

### Example

```ts
import { CustomResourceConstruct } from './custom_resource/construct';

const cr = new CustomResourceConstruct(this, 'MyCustomResource', {
  vpc: vpc,
  resourceType: 'Custom::MyResource',
});
```

### Initializer

```ts
new CustomResourceConstruct(scope: Construct, id: string, props: CustomResourceProps)
```

内部で以下のリソースを作成する:

1. `Repository` — ECR リポジトリ
2. `Role` — Lambda 実行ロール
3. `Lambda` — DockerImageFunction
4. `CustomResource` — Provider + CustomResource

### Construct Props

| Name | Type | Description |
|---|---|---|
| `vpc` | `ec2.IVpc` | Provider を配置する VPC |
| `resourceType?` | `string` | カスタムリソースのタイプ名（例: `Custom::MyResource`） |
