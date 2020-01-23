## 通常の開発環境

### 初回のみ
```bash

git clone https://github.com/baron-todo-app/server
cd server
git submodule update --init --recursive


# db のみ起動 して nodeはローカルで dockerのホットリロードが遅いため
docker-compose up --build -d app_db;  docker-compose ps

# npm
yarn 


# マイグレーション 実行
yarn ts-node $(npm bin)/typeorm migration:run

# DB ドキュメント
docker-compose up app_db schemaspy
# schemaspy_local exited with code 0
# ctrl + c
yarn http-server doc/schemaspy

# コードドキュメント
yarn compodoc -p tsconfig.json -d doc/compodoc
yarn http-server doc/compodoc -p 8081

# test
yarn test:cov
yarn http-server doc/coverage/lcov-report -p 8082

# 起動
yarn start:dev

# GQL
# http://localhost:5000/voyager
# http://localhost:5000/graphql

# DB 
# http://127.0.0.1:8080

# コードドキュメント
# http://127.0.0.1:8081

# カバレッジ
# http://127.0.0.1:8082
```

### 2回目以降
```bash
# db のみ起動 して nodeはローカルで dockerのホットリロードが遅いため
docker-compose up --build -d app_db;  docker-compose ps

# 起動
yarn start:dev
```

## mysql 接続
```bash
mysql -uroot -p -h 127.0.0.1
```

## 開発環境でのテスト
```bash
# DB関連の操作不可 -> つまり mockにする
# nestjsの思想, unit testの思想
yarn test
```
## TypeORM で マイグレーション (初回)

xxx.entity.ts でモデル定義  

```bash
# マイグレーションファイル作成
yarn ts-node $(npm bin)/typeorm migration:generate -n Initialize

# マイグレーション 実行
yarn ts-node $(npm bin)/typeorm migration:run

# マイグレーション 戻し
yarn ts-node $(npm bin)/typeorm migration:revert
```

## TypeORM で マイグレーション (2回目以降)

```bash
# マイグレーション 実行
yarn ts-node $(npm bin)/typeorm migration:run
```


## TypeORM で Alter Table したい

xxx.entity.ts でモデル更新

```bash
# これを育てる
typeorm migration:create -n Xxx
```

https://github.com/typeorm/typeorm/blob/master/docs/migrations.md
> 他に方法無し...


## TypeOrm テーブル コメントつけたい

たぶん、今のとこはない 追加予定らしい  

```sql
ALTER TABLE xxx COMMENT 'タスクを管理'
```

## GQL memo

```gql
query  {
  foo: getTasks(FreeWord: {txt: ""}) {
    id
    title
    body
  }
}

query  {
  cc: getTask(GetTask: {id: 1}) {
    id
    title
  }  
}

mutation {
  addTask(AddTask: {title: "aaa" body: "bbb"}) {
    id
    title
    body
  }
}

mutation {
  updateTask(
    UpdateTask:{
      id: 1
      title: "aaa"
      body: "bbb"
    }) {
    id
  }
}

mutation {
 deleteTask(DeleteTask:{id: 1}) {
     id
     title
 }
}
```

## docker memo
```bash
# 初期
docker pull mysql:5.7.24
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=mysql -e MYSQL_DATABASE=task -p 3306:3306  mysql:5.7.24 --character-set-server=utf8 --collation-server=utf8_unicode_ci

# 開始
docker start mysql

# 停止
docker stop mysql

# 対話形式
docker exec -it mysql bash
mysql -uroot -p
mysql
```

## sql memo
```sql
insert into task.todo (title, body) values ("aaa", "abcd efg");
insert into task.todo (title, body) values ("aaa", "100%");
insert into task.todo (title, body) values ("bbb", "0% % _");
insert into task.todo (title, body) values ("bbb", "hoge fuga");
insert into task.todo (title, body) values ("bbb", "100% 200% 300%");
insert into task.todo (title, body) values ("bbb", "__ abc efg");
insert into task.todo (title, body) values ("bbb", "\\");

select * from task.todo;
delete from task.todo; select * from task.todo;

drop database task; create database task;
```

## url
- http://localhost:5000/voyager
  - GQL関連全体像

- http://localhost:5000/graphql
  - GQLプレイグラウンド

## doc
- mysql
  - docker-compose up app_db schemaspy
- compodoc
  - yarn compodoc -p tsconfig.json -d doc/compodoc
  - yarn compodoc -p tsconfig.json -s # サーバ起動
---


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://gitter.im/nestjs/nestjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge"><img src="https://badges.gitter.im/nestjs/nestjs.svg" alt="Gitter" /></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor) [![Greenkeeper badge](https://badges.greenkeeper.io/baron-todo-app/server.svg)](https://greenkeeper.io/)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

  Nest is [MIT licensed](LICENSE).
