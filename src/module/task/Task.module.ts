import { Module } from '@nestjs/common';
import { TaskResolver } from 'module/task/Task.resolvers';
import { TaskService } from './Task.service';
import { TodoEntity } from 'entities/Todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'app.service';

export { TaskModule };

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity])],
  providers: [TaskResolver, TaskService, AppService],
})
class TaskModule {}
