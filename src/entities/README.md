# ORM用ディレクトリ

`entity`から`DB`の管理を行う  
`DDL`、バージョン管理

## ファイル名と内容

### `Foo.entity.ts`

```js
@Entity({
  name: 'foo',
})
class FooEntity {}
```

`class`の接尾後に、`Entity`をつける  
つけない場合は、ユニークなクラス名を保ちにくいため  
ただし、テーブル名の末尾に`Entity`が付与されるため  
`annotation`の`name`で調整
