import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';
import { message } from 'config/message';
import { config } from 'share/config';

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
    length: config.todoEntity.title.length,
    nullable: false,
  })
  @IsNotEmpty({
    message: `${todo.title.isNotEmpty.message}`,
  })
  @MaxLength(config.todoEntity.title.length, {
    message: `${config.todoEntity.title.length}${todo.title.maxLength.message}`,
  })
  title: string;

  @Column({
    type: 'varchar',
    comment: 'todo 補足やメモ',
    length: config.todoEntity.body.length,
    nullable: true,
    default: '',
  })
  @ValidateIf(o => o.hasOwnProperty('body'))
  @IsString({
    message: todo.body.isString.message,
  })
  @MaxLength(config.todoEntity.body.length, {
    message: `${config.todoEntity.body.length}${todo.body.maxLength.message}`,
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
