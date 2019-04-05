import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';
import { message } from 'config/message';

const { todo } = message.entity;

export { todoEntityCnf, TodoEntity };

const todoEntityCnf = {
  title: {
    length: 10,
  },
  body: {
    length: 30,
  },
};

@Entity({
  name: 'todo',
})
class TodoEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'varchar',
    comment: 'todo のタイトル, 概要',
    length: todoEntityCnf.title.length,
    nullable: false,
  })
  @IsNotEmpty({
    message: `${todo.title.isNotEmpty.message}`,
  })
  @MaxLength(todoEntityCnf.title.length, {
    message: `${todoEntityCnf.title.length}${todo.title.maxLength.message}`,
  })
  title: string;

  @Column({
    type: 'varchar',
    comment: 'todo 補足やメモ',
    length: todoEntityCnf.body.length,
    nullable: true,
    default: '',
  })
  @ValidateIf(o => o.hasOwnProperty('body'))
  @IsString({
    message: todo.body.isString.message,
  })
  @MaxLength(todoEntityCnf.body.length, {
    message: `${todoEntityCnf.body.length}${todo.body.maxLength.message}`,
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
