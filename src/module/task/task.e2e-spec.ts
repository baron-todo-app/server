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
import { Query, Task } from 'share/graphql.type';
import { getTasks } from 'share/gqlRepository/task';

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
    const query = gql`mutation { addTask(AddTask: {title: "${title}", body: "${body}" })  { id title body }  }`;
    const r = await callGQL(query);

    expect(r.body.data.addTask).toMatchObject({
      title,
      body,
    });
    return r.body.data.addTask;
  }

  /**
   * タスク追加
   * 更新や、論理削除のテストの際に データ作るのに利用
   */
  async function softDeleteTaskUnit(): Promise<TaskObject> {
    const { id, title, body } = await addTaskUnit();
    const query = gql`mutation { deleteTask(DeleteTask: {id: ${id} }) {id title body} }`;
    const r = await callGQL(query);

    expect(r.body.data.deleteTask).toMatchObject({
      id,
      title,
      body,
    });
    return r.body.data.deleteTask;
  }

  describe('getTask', () => {
    it('取得', async () => {
      const id = 2;
      const query = gql`query{ getTask(GetTask: {id: ${id} }) { id  title body } }`;
      const r = await callGQL(query);
      const adjust = 1; // arrayは 0 スタートだが DBのidは1からの為 ズレの調整
      const e = { id, ...todoEntityFixture[id - adjust] };
      expect(r.body.data.getTask).toMatchObject(e);
    });

    it('論理削除済', async () => {
      const query = gql`
        query {
          getTask(GetTask: { id: 1 }) {
            id
            title
            body
          }
        }
      `;
      const r = await callGQL(query);
      expectNothing(r);
    });

    it('パラメタ不備', async () => {
      const query = gql`
        query {
          getTask(GetTask: { id: "a" }) {
            id
            title
            body
          }
        }
      `;
      const r = await callGQL(query);
      expect(r.error).toBeDefined();
    });

    it('対象データ無し', async () => {
      const query = gql`
        query {
          getTask(GetTask: { id: 0 }) {
            id
            title
            body
          }
        }
      `;
      const r = await callGQL(query);
      expectNothing(r);
    });
  });

  describe('getTasks', () => {
    // --------------------------------
    it('xx', async () => {
      const r: Array<keyof Task> = ['id', 'title', 'body'];
      const query = getTasks({ txt: '' }, r);
      const data: Pick<Query, 'getTasks'> = (await callGQL(query)).body.data;
      console.log(data.getTasks[0]);
    });
    // --------------------------------

    it('取得', async () => {
      const query = gql`
        query {
          getTasks(FreeWord: { txt: "" }) {
            id
            title
            body
          }
        }
      `;
      const r = await callGQL(query);
      const adjust = 1; // 論理削除分
      expect(r.body.data.getTasks.length).toBeGreaterThanOrEqual(
        todoEntityFixture.length - adjust,
      );
    });

    it('論理削除済', async () => {
      const txt = 'ゴミ捨て';
      const query = gql`query{ getTasks(FreeWord: {txt: "${txt}" }) { id  title body } }`;
      const r = await callGQL(query);
      expectEmpty(r);
    });

    it('対象データ無し', async () => {
      const txt = 'xxxxxxxxxxxxxxxx';
      const query = gql`query{ getTasks(FreeWord: {txt: "${txt}" }) { id  title body } }`;
      const r = await callGQL(query);
      expectEmpty(r);
    });

    it('文字数オーバー', async () => {
      const txt =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const query = gql`query{ getTasks(FreeWord: {txt: "${txt}"}) { id  title body } }`;

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
      const txt = 'abc';
      const body =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const query = gql`mutation { addTask(AddTask: {title: "${txt}", body: "${body}" })  { title body }  }`;
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
      const txt =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const body =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
      const query = gql`mutation { addTask(AddTask: {title: "${txt}", body: "${body}" })  { title body }  }`;
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
        const query = gql`mutation { updateTask(UpdateTask: {id: ${id} title: "${title2}", body: "${body2}" })  { id title body }  }`;
        const r = await callGQL(query);

        expect(r.body.data.updateTask).toMatchObject({
          id,
          title: title2,
          body: body2,
        });
      });

      it('更新失敗', async () => {
        const { id, title, body } = await softDeleteTaskUnit();
        const query = gql`mutation { updateTask(UpdateTask: {id: ${id} title: "${title}", body: "${body}" })  { id title body }  }`;
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
        const query = gql`mutation { deleteTask(DeleteTask: {id: ${id} }) {id title body} }`;
        const r = await callGQL(query);
        expectNothing(r);
      });
    });
  });
});
