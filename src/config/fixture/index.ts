import { TodoEntity } from 'entities/Todo.entity';
import * as faker from 'faker';

export { todoEntityFixture };

const todoEntityFixture: TodoEntity[] = [
  {
    title: 'ゴミ捨て',
    deleteAt: new Date(),
  },
  {
    title: '会議をする',
    body: `田中さんに参加依頼を出す`,
  },
  {
    title: 'ランチに行く',
  },
  {
    title: '会議をする',
    body: `${faker.name.findName()}さんに参加依頼を出す`,
  },
  {
    title: 'ランチ予約',
    body: `${faker.name.findName()}さんも`,
  },
];
