import { getConnection } from 'typeorm';
import { TodoEntity } from '../../../src/entities/Todo.entity';
import { todoEntityFixture } from '../../../src/config/fixture';

export {
  TodoEntityFixture,
};

const TodoEntityFixture = async () => {
  await getConnection().createQueryBuilder()
    .insert()
    .into(TodoEntity)
    .values(todoEntityFixture)
    .execute();
};
