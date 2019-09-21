import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'dev') {
    app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));
  }

  await app.listen(5000);
}

bootstrap();

// todo ステージング対応
// docker-compose app_api

// todo フロントとserverで共通化 share/
// config

// todo
// voyager doc

// todo
// CI, CD

// todo
// docを出力する docker

// todo
// testをする docker

// todo
// エラー時ログ

// todo
// 本番モードでは不要な情報はかえさない
