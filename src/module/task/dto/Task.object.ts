/* tslint:disable:max-classes-per-file */
import { Field, Int, ObjectType } from 'type-graphql';

export { TaskObject };

@ObjectType('Task', { description: 'Task の詳細情報' })
class TaskObject {
  @Field(type => Int)
  id: number;

  @Field({
    description: 'Task のタイトル, 概要',
  })
  title: string;

  @Field({
    description: 'Task 補足やメモ',
  })
  body: string;
}
