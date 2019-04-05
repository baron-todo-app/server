import { Module } from '@nestjs/common';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TaskModule } from 'module/task/Task.module';
import { TypeOrmModule } from '@nestjs/typeorm';

export { AppModule };

const modules = [TaskModule];

@Module({
  imports: [
    ...modules,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      debug: process.env.NODE_ENV === 'dev',
      playground: process.env.NODE_ENV === 'dev',
      installSubscriptionHandlers: true,
      autoSchemaFile: 'src/share/graphql/schema.graphql',
    }),
    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}
