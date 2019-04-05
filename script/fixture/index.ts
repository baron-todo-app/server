import { createConnection } from 'typeorm';
import * as cnf from '../../ormconfig';
import { TodoEntityFixture } from './todoEntityFixture';

const fixture = async () => {
  await createConnection({ ...cnf });
  await TodoEntityFixture();

  process.exit(0);
};

fixture();
