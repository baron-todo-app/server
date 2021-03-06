/* tslint:disable:max-classes-per-file */
import { Field, Int, InputType } from 'type-graphql';
import {
  IsNumber,
  IsString,
  MaxLength,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { message } from 'share/message';
import { entity } from 'share/config';

const { getTask, freeWord, addTask } = message.dto.task;

export { GetTask, AddTask, FreeWord, UpdateTask, DeleteTask };

@InputType()
class GetTask {
  @Field(type => Int, {
    description: '***対象id***',
  })
  @IsNumber(
    {},
    {
      message: getTask.id.isNumber.message,
    },
  )
  id: number;
}

@InputType()
class AddTask {
  @Field({
    description: 'Task のタイトル, 概要',
  })
  @IsString({
    message: addTask.title.isString.message,
  })
  @IsNotEmpty({
    message: `${addTask.title.isNotEmpty.message}`,
  })
  @MaxLength(entity.todo.title.length, {
    message: `${entity.todo.title.length}${addTask.title.maxLength.message}`,
  })
  title: string;

  @Field({
    description: 'Task 補足やメモ',
    nullable: true,
  })
  @ValidateIf(o => o.hasOwnProperty('body'))
  @IsString({
    message: addTask.body.isString.message,
  })
  @MaxLength(entity.todo.body.length, {
    message: `${entity.todo.body.length}${addTask.body.maxLength.message}`,
  })
  body?: string;
}

@InputType({
  description:
    '返却値の`String`が対象 高付加 & レスポンスが遅いので利用は計画的に!!',
})
class FreeWord {
  @Field({
    description: '`xxx like %txt%` になる  `txt: ""` で全件取得',
  })
  @MaxLength(entity.todo.body.length, {
    message: `${entity.todo.body.length}${freeWord.txt.maxLength.message}`,
  })
  txt: string;
}

// 多重継承が無いため冗長になることは回避不能
@InputType()
class UpdateTask {
  @Field(type => Int, {
    description: '***対象id***',
  })
  @IsNumber(
    {},
    {
      message: getTask.id.isNumber.message,
    },
  )
  id: number;

  @Field({
    description: 'Task のタイトル, 概要',
  })
  @IsString({
    message: addTask.title.isString.message,
  })
  @MaxLength(entity.todo.title.length, {
    message: `${entity.todo.title.length}${addTask.title.maxLength.message}`,
  })
  @IsNotEmpty({
    message: `${addTask.title.isNotEmpty.message}`,
  })
  title: string;

  @Field({
    description: 'Task 補足やメモ',
    nullable: true,
  })
  @ValidateIf(o => o.hasOwnProperty('body'))
  @IsString({
    message: addTask.body.isString.message,
  })
  @MaxLength(entity.todo.body.length, {
    message: `${entity.todo.body.length}${addTask.body.maxLength.message}`,
  })
  body?: string;
}

// 多重継承が無いため冗長になることは回避不能
@InputType()
class DeleteTask {
  @Field(type => Int, {
    description: '***対象id***',
  })
  @IsNumber(
    {},
    {
      message: getTask.id.isNumber.message,
    },
  )
  id: number;
}
