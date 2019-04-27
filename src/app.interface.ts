export { ISoftDelete };
import { FindOperator } from 'typeorm';

interface ISoftDelete {
  deleteAt: Date | FindOperator<any>;
}
