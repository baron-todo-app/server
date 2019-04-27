import { AppService } from './app.service';
import { Test, TestingModule } from '@nestjs/testing';
import { IsNull } from 'typeorm';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('throughDelete', () => {
    expect(service.throughDelete()).toMatchObject({ deleteAt: IsNull() });
  });

  it('makeLike', () => {
    expect(service.makeLike('a')).toBe('%a%');
    expect(service.makeLike('')).toBe('%%');
    expect(service.makeLike('100%')).toBe('%100\\%%');
    expect(service.makeLike('100_')).toBe('%100\\_%');
    expect(service.makeLike('100\\')).toBe('%100\\\\%');

    expect(service.makeLike('%')).toBe('%\\%%');
    expect(service.makeLike('%%')).toBe('%\\%\\%%');
    expect(service.makeLike('%%%')).toBe('%\\%\\%\\%%');

    expect(service.makeLike('_')).toBe('%\\_%');
    expect(service.makeLike('__')).toBe('%\\_\\_%');
    expect(service.makeLike('___')).toBe('%\\_\\_\\_%');

    expect(service.makeLike('\\')).toBe('%\\\\%');
    expect(service.makeLike('\\\\')).toBe('%\\\\\\\\%');
    expect(service.makeLike('\\\\\\')).toBe('%\\\\\\\\\\\\%');

    expect(service.makeLike('%_\\')).toBe('%\\%\\_\\\\%');
  });
});
