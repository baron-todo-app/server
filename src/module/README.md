# 1つの処理のするmodule用ディレクトリ

`import` は、相対パス  -> `import { FooService } ./Foo.service.`


## ファイル名と内容

### `dto/Foo.input.ts`  
`GQL`の`resolvers`の`Query`シグネチャ、ホワイトリスト

### `dto/Foo.object.ts`  
`GQL`の`resolvers`の`Query`の戻り

### `Foo.resolvers.ts`  
`GQL`の`resolvers`の実処理  
`MVC`の`C`相当


### その他
`nestjs`の`CLI`で生成されるファイル  
特筆事項なし

`Foo.moudule.ts`  
`Foo.service.ts`  
`foo.service.spec.ts`  
