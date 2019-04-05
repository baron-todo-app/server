import { AppService } from './app.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('throughDelete', () => {
    expect(service.throughDelete()).toMatchObject({ deleteAt: null });
  });

  it('makeLike', () => {
    expect(service.makeLike('a').value).toBe('%a%');
    expect(service.makeLike('').value).toBe('%%');
    expect(service.makeLike('100%').value).toBe('%100\\%%');
    expect(service.makeLike('100_').value).toBe('%100\\_%');
    expect(service.makeLike('100\\').value).toBe('%100\\\\%');

    expect(service.makeLike('%').value).toBe('%\\%%');
    expect(service.makeLike('%%').value).toBe('%\\%\\%%');
    expect(service.makeLike('%%%').value).toBe('%\\%\\%\\%%');

    expect(service.makeLike('_').value).toBe('%\\_%');
    expect(service.makeLike('__').value).toBe('%\\_\\_%');
    expect(service.makeLike('___').value).toBe('%\\_\\_\\_%');

    expect(service.makeLike('\\').value).toBe('%\\\\%');
    expect(service.makeLike('\\\\').value).toBe('%\\\\\\\\%');
    expect(service.makeLike('\\\\\\').value).toBe('%\\\\\\\\\\\\%');

    expect(service.makeLike('%_\\').value).toBe('%\\%\\_\\\\%');
  });
});
