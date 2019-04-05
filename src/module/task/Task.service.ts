import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from 'entities/Todo.entity';
import { Repository } from 'typeorm';
import { GetTask, FreeWord, AddTask, UpdateTask } from './dto';
import { plainToClass } from 'class-transformer';
import { TaskObject } from './dto';
import { ICRUDService } from 'module/crudResolver.interface';
import { ISoftDelete } from 'app.interface';
import { AppService } from 'app.service';
import { validate } from 'class-validator';

export { TaskService };

type TaskServiceType = ICRUDService<TaskObject, TodoEntity>;

@Injectable()
class TaskService implements TaskServiceType {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todo: Repository<TodoEntity>,
    private readonly appService: AppService,
  ) {}

  findOneTask(p: GetTask) {
    return (this.todo.findOne(p.id, {
      where: { ...this.appService.throughDelete() },
    }) as any) as TaskObject;
  }

  findTasks(p: FreeWord) {
    const where = this.makeWare(p);
    return (this.todo.find({
      where: { ...where, ...this.appService.throughDelete() },
    }) as any) as TaskObject[];
  }

  async addTask(p: AddTask) {
    const v = plainToClass(TodoEntity, p);
    return await this.safeSave(v);
  }

  async updateTask(t: TodoEntity, p: UpdateTask) {
    const v = plainToClass(TodoEntity, { ...t, ...p });
    return await this.safeSave(v);
  }

  async softDeleteTask(t: TodoEntity, p: ISoftDelete) {
    const v = plainToClass(TodoEntity, { ...t, ...p });
    return await this.safeSave(v);
  }

  private makeWare(p: FreeWord) {
    if (p.txt === '') {
      return [];
    }
    const condition = this.appService.makeLike(p.txt);
    // classのpropertyをなめて、抽出可能だが省略
    return {
      title: condition,
      body: condition,
    };
  }

  private async safeSave(v: TodoEntity): Promise<TaskObject> {
    const errors = await validate(v);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    try {
      return ((await this.todo.save(v)) as any) as TaskObject;
    } catch (error) {
      /* istanbul ignore next */
      throw new UnprocessableEntityException(errors);
    }
  }
}
