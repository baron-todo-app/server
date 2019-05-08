import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';
import { message } from '../share/message'; // migration用に相対パス
import { entity } from '../share/config'; // migration用に相対パス

const { todo } = message.entity;

export { TodoEntity };

@Entity({
  name: 'todo',
})
class TodoEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'varchar',
    comment: 'todo のタイトル, 概要',
    length: entity.todo.title.length,
    nullable: false,
  })
  @IsNotEmpty({
    message: `${todo.title.isNotEmpty.message}`,
  })
  @MaxLength(entity.todo.title.length, {
    message: `${entity.todo.title.length}${todo.title.maxLength.message}`,
  })
  title: string;

  @Column({
    type: 'varchar',
    comment: 'todo 補足やメモ',
    length: entity.todo.body.length,
    nullable: true,
    default: '',
  })
  @ValidateIf(o => o.hasOwnProperty('body'))
  @IsString({
    message: todo.body.isString.message,
  })
  @MaxLength(entity.todo.body.length, {
    message: `${entity.todo.body.length}${todo.body.maxLength.message}`,
  })
  body?: string;

  @Column({
    type: 'timestamp',
    comment: '論理削除',
    nullable: true,
    default: null,
  })
  deleteAt?: Date;
}
