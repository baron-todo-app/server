import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './Task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity, todoEntityCnf } from 'entities/Todo.entity';
import { GetTask, FreeWord, UpdateTask, DeleteTask } from './dto';
import { AppService } from 'app.service';
import * as _ from 'lodash';
import { message } from 'config/message';

const { todo } = message.entity;

describe('TaskService', () => {
  let service: TaskService;
  const errPath = 'response.message[0]';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        AppService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: {
            findOne: (p: GetTask) => true,
            find: (p: FreeWord) => true,
            save: (p: any) => true,
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('findOneTask', () => {
    expect(service.findOneTask({ id: 10 })).toBeTruthy();
  });

  it('findTasks', () => {
    expect(service.findTasks({ txt: '' })).toBeTruthy();
    expect(service.findTasks({ txt: 'foo' })).toBeTruthy();
  });

  describe('addTask', () => {
    it('ok', async () => {
      const r = await service.addTask({ title: 'ok', body: '' });
      expect(r).toBe(true);
    });

    it('エラー1', async done => {
      try {
        await service.addTask({
          title: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          body: '',
        });
      } catch (e) {
        const { property, constraints } = _.get(e, errPath);
        expect(property).toBe('title');
        expect(constraints).toMatchObject({
          maxLength: `${todoEntityCnf.title.length}${
            todo.title.maxLength.message
          }`,
        });
        done();
      }
    });

    it('エラー2', async done => {
      try {
        await service.addTask({ title: '', body: '' });
      } catch (e) {
        const { property, constraints } = _.get(e, errPath);
        expect(property).toBe('title');
        expect(constraints).toMatchObject({
          isNotEmpty: `${todo.title.isNotEmpty.message}`,
        });
        done();
      }
    });

    it('エラー3', async done => {
      try {
        await service.addTask({
          title: 'ok',
          body:
            'ngggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
        });
      } catch (e) {
        const { property, constraints } = _.get(e, errPath);
        expect(property).toBe('body');
        expect(constraints).toMatchObject({
          maxLength: `${todoEntityCnf.body.length}${
            todo.body.maxLength.message
          }`,
        });
        done();
      }
    });
  });

  describe('updateTask', () => {
    it('ok', () => {
      expect(
        service.updateTask({ ...new TodoEntity() }, { ...new UpdateTask() }),
      ).toBeTruthy();
    });

    it('エラー1', async done => {
      try {
        const t = new TodoEntity();
        t.title = 'base';
        t.body = 'base';

        const p = new UpdateTask();
        p.id = 1;
        p.title =
          'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        p.body = '';

        await service.updateTask(t, p);
      } catch (e) {
        const { property, constraints } = _.get(e, errPath);
        expect(property).toBe('title');
        expect(constraints).toMatchObject({
          maxLength: `${todoEntityCnf.title.length}${
            todo.title.maxLength.message
          }`,
        });
        done();
      }
    });

    it('エラー2', async done => {
      try {
        const t = new TodoEntity();
        t.title = 'base';
        t.body = 'base';

        const p = new UpdateTask();
        p.id = 1;
        p.title = '';
        p.body = '';

        await service.updateTask(t, p);
      } catch (e) {
        const { property, constraints } = _.get(e, errPath);
        expect(property).toBe('title');
        expect(constraints).toMatchObject({
          isNotEmpty: `${todo.title.isNotEmpty.message}`,
        });
        done();
      }
    });

    it('エラー3', async done => {
      try {
        const t = new TodoEntity();
        t.title = 'base';
        t.body = 'base';

        const p = new UpdateTask();
        p.id = 1;
        p.title = 'ok';
        p.body =
          'ngggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg';

        await service.updateTask(t, p);
      } catch (e) {
        const { property, constraints } = _.get(e, errPath);
        expect(property).toBe('body');
        expect(constraints).toMatchObject({
          maxLength: `${todoEntityCnf.body.length}${
            todo.body.maxLength.message
          }`,
        });
        done();
      }
    });
  });

  describe('softDeleteTask', () => {
    it('ok', () => {
      expect(
        service.softDeleteTask(
          { ...new TodoEntity() },
          { deleteAt: new Date() },
        ),
      ).toBeTruthy();
    });
  });
});
