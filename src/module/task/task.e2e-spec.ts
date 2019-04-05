import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'app.module';
import * as _ from 'lodash';
import { badRequestException } from './Task.resolvers';
import { Response } from 'supertest';
import { todoEntityFixture } from 'config/fixture';
import { todoEntityCnf } from 'entities/Todo.entity';
import { message } from 'config';
import { TaskObject } from './dto';
import gql from 'graphql-tag';
import { print } from 'graphql/language/printer';
import { Query, Task, Mutation } from 'share/graphql.type';
import { getTasksQ, getTaskQ, addTaskQ, deleteTaskQ, updateTaskQ } from 'share/gqlRepository/task';

const { freeWord, addTask } = message.dto.task;

describe('task (e2e)', () => {
  let app;
  const errPath = 'body.errors[0].message.message[0]';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    request(app.getHttpServer()).post('/graphql');
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  /**
   * GQL呼び出し
   * @param q
   */
  async function callGQL(q) {
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: print(q) });
  }

  /**
   * 対象データ無しのexpect
   * @param r
   */
  function expectNothing(r: Response) {
    const { property, constraints } = _.get(r, errPath);
    expect(property).toBe(badRequestException.property);
    expect(constraints).toBe(badRequestException.constraints);
  }

  /**
   * 対象データ無[]のexpect
   * @param r
   */
  function expectEmpty(r: Response) {
    expect(r.body.data.getTasks.length).toBe(0);
  }

  /**
   * タスク追加
   * 更新や、論理削除のテストの際に データ作るのに利用
   */
  async function addTaskUnit(): Promise<TaskObject> {
    const title = 'foo';
    const body = 'bar';
    const query = addTaskQ({ title, body });
    const data: Pick<Mutation, 'addTask'> = (await callGQL(query)).body.data;

    expect(data.addTask).toMatchObject({
      title,
      body,
    });
    return data.addTask;
  }

  /**
   * タスク追加
   * 更新や、論理削除のテストの際に データ作るのに利用
   */
  async function softDeleteTaskUnit(): Promise<TaskObject> {
    const { id, title, body } = await addTaskUnit();
    const query = deleteTaskQ({ id });
    const data: Pick<Mutation, 'deleteTask'> = (await callGQL(query)).body.data;

    expect(data.deleteTask).toMatchObject({
      id,
      title,
      body,
    });
    return data.deleteTask;
  }

  describe('getTask', () => {
    it('取得', async () => {
      const id = 2;
      const query = getTaskQ({ id });
      const data: Pick<Query, 'getTask'> = (await callGQL(query)).body.data;
      const adjust = 1; // arrayは 0 スタートだが DBのidは1からの為 ズレの調整
      const e = { id, ...todoEntityFixture[id - adjust] };
      expect(data.getTask).toMatchObject(e);
    });

    it('論理削除済', async () => {
      const r: Array<keyof Task> = ['id', 'title', 'body'];
      const query = getTaskQ({ id: 1 }, r);
      const r2 = await callGQL(query);

      expectNothing(r2);
    });

    it('対象データ無し', async () => {
      const query = getTaskQ({ id: 0 });
      const r = await callGQL(query);
      expectNothing(r);
    });
  });

  describe('getTasks', () => {
    it('取得', async () => {
      const query = getTasksQ({ txt: '' });
      const data: Pick<Query, 'getTasks'> = (await callGQL(query)).body.data;
      const adjust = 1; // 論理削除分
      expect(data.getTasks.length).toBeGreaterThanOrEqual(
        todoEntityFixture.length - adjust,
      );
    });

    it('論理削除済', async () => {
      const txt = 'ゴミ捨て';
      const query = getTasksQ({ txt });
      const r = await callGQL(query);
      expectEmpty(r);
    });

    it('対象データ無し', async () => {
      const txt = 'xxxxxxxxxxxxxxxx';
      const query = getTasksQ({ txt });
      const r = await callGQL(query);
      expectEmpty(r);
    });

    it('文字数オーバー', async () => {
      const txt =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const query = getTasksQ({ txt });
      const r = await callGQL(query);
      const { property, constraints } = _.get(r, errPath);
      expect(property).toBe('txt');
      expect(constraints).toMatchObject({
        maxLength: `${todoEntityCnf.body.length}${
          freeWord.txt.maxLength.message
          }`,
      });
    });
  });

  describe('addTask', () => {
    it('追加', async () => {
      const title = 'foo';
      const query = gql`mutation { addTask(AddTask: {title: "${title}"})  { title body }  }`;
      const r = await callGQL(query);
      expect(r.body.data.addTask).toMatchObject({
        title,
        body: '',
      });
    });

    it('追加2', async () => {
      await addTaskUnit();
    });

    it('追加失敗', async () => {
      const title =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const query = gql`mutation { addTask(AddTask: {title: "${title}", body: "bar" })  { title body }  }`;
      const r = await callGQL(query);
      const { property, constraints } = _.get(r, errPath);
      expect(property).toBe('title');
      expect(constraints).toMatchObject({
        maxLength: `${todoEntityCnf.title.length}${
          addTask.title.maxLength.message
          }`,
      });
    });

    it('追加失敗2', async () => {
      const title = 'abc';
      const body =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const query = addTaskQ({ title, body });
      const r = await callGQL(query);
      const { property, constraints } = _.get(r, errPath);
      expect(property).toBe('body');
      expect(constraints).toMatchObject({
        maxLength: `${todoEntityCnf.body.length}${
          addTask.body.maxLength.message
          }`,
      });
    });

    it('追加失敗3', async () => {
      const title =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const body =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const query = addTaskQ({ title, body });
      const r = await callGQL(query);
      const { property, constraints } = _.get(r, errPath);
      expect(property).toBe('title');
      expect(constraints).toMatchObject({
        maxLength: `${todoEntityCnf.title.length}${
          addTask.title.maxLength.message
          }`,
      });
      expect(r.body.errors[0].message.message[1].property).toBe('body');
      expect(r.body.errors[0].message.message[1].constraints).toMatchObject({
        maxLength: `${todoEntityCnf.body.length}${
          addTask.body.maxLength.message
          }`,
      });
    });

    describe('updateTask', () => {
      it('更新', async () => {
        const { id } = await addTaskUnit();
        const title2 = 'foo2';
        const body2 = 'bar2';

        const query = updateTaskQ({ id, title: title2, body: body2 });
        const r = await callGQL(query);

        expect(r.body.data.updateTask).toMatchObject({
          id,
          title: title2,
          body: body2,
        });
      });

      it('更新失敗', async () => {
        const { id, title, body } = await softDeleteTaskUnit();
        const query = updateTaskQ({ id, title, body });
        const r = await callGQL(query);
        expectNothing(r);
      });
    });

    describe('deleteTask', () => {
      it('論理削除', async () => {
        await softDeleteTaskUnit();
      });

      it('論理削除失敗', async () => {
        const { id } = await softDeleteTaskUnit();

        // 上で削除したデータを再度削除
        const query = deleteTaskQ({ id });

        const r = await callGQL(query);
        expectNothing(r);
      });
    });
  });
});
