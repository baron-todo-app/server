import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { NotFoundException, UsePipes } from '@nestjs/common';
import { TaskService } from './Task.service';
import { ValidationPipe } from 'pipe/Validation.pipe';
import {
  TaskObject,
  GetTask,
  FreeWord,
  AddTask,
  UpdateTask,
  DeleteTask,
} from './dto';
import { ICRUDResolver } from 'module/crudResolver.interface';
import { message } from 'share/message';

export { TaskResolver };

type TaskResolverType = ICRUDResolver<TaskObject>;

export const badRequestException = {
  property: null,
  constraints: message.exception.nothing,
};

@UsePipes(ValidationPipe)
@Resolver(of => TaskObject)
class TaskResolver implements TaskResolverType {
  constructor(private readonly taskService: TaskService) {}

  @Query(returns => TaskObject, { description: 'タスクの取得' })
  getTask(@Args('GetTask') p: GetTask) {
    return this.preFetch(p);
  }

  @Query(returns => [TaskObject], { description: '複数タスクの取得' })
  getTasks(@Args('FreeWord') p: FreeWord) {
    return this.taskService.findTasks(p);
  }

  @Mutation(returns => TaskObject, { description: 'タククを1件追加' })
  addTask(@Args('AddTask') p: AddTask) {
    return this.taskService.addTask(p);
  }

  @Mutation(returns => TaskObject, { description: 'タスクを1件更新' })
  async updateTask(@Args('UpdateTask') p: UpdateTask) {
    const t = await this.preFetch(p);
    return this.taskService.updateTask(t, p);
  }

  @Mutation(returns => TaskObject, { description: 'タスクを1件論理削除' })
  async deleteTask(@Args('DeleteTask') p: DeleteTask) {
    const t = await this.preFetch(p);
    return this.taskService.softDeleteTask(t, { deleteAt: new Date() });
  }

  // デコレータで定義可能だが、型とGQLの相性が悪い
  private async preFetch(p: GetTask) {
    const r = await this.taskService.findOneTask(p);
    if (!r) {
      throw new NotFoundException({
        message: [{ ...badRequestException }],
      });
    }
    return r;
  }
}
