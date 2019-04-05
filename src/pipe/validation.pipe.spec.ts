/* tslint:disable:max-classes-per-file */
import { ValidationPipe } from './Validation.pipe';
import { ArgumentMetadata } from '@nestjs/common';
import { GetTask } from '../module/task/dto';

describe('ValidationPipe', () => {
  let target: ValidationPipe;
  const value = { prop1: 'value1', prop2: 'value2' };

  beforeEach(() => {
    target = new ValidationPipe();
  });

  it('validate対象外', async () => {
    const metadata = {} as ArgumentMetadata;

    const r = await target.transform(value, metadata);
    expect(r).toEqual(value);
  });

  it('validate対象OK', async () => {
    const metadata: ArgumentMetadata = {
      type: 'param',
      metatype: class {},
      data: '',
    };

    const r = await target.transform(value, metadata);
    expect(r).toEqual(value);
  });

  it('validate対象NG', async () => {
    const metadata: ArgumentMetadata = {
      type: 'param',
      metatype: GetTask, // todoテスト用に別途準備
      data: '',
    };
    await expect(target.transform(value, metadata)).rejects.toThrow();
  });
});
