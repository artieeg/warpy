import { BannedFromStreamError } from '@backend_2/errors';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { StreamBlockEntity } from './stream-block.entity';
import { mockedStreamBlockEntity } from './stream-block.entity.mock';
import { StreamBlockService } from './stream-block.service';

describe('StreamBlock service', () => {
  let streamBlockService: StreamBlockService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(StreamBlockEntity)
      .useValue(mockedStreamBlockEntity)
      .compile();

    streamBlockService = m.get(StreamBlockService);
  });

  it('throws nothing if the user is not banned', () => {
    expect(streamBlockService.checkUserBanned('test', 'test')).resolves;
  });

  it('throws an error if the user is banned from a stream', () => {
    mockedStreamBlockEntity.find.mockResolvedValueOnce({
      block: 'test-block',
    } as any);

    expect(
      streamBlockService.checkUserBanned('test', 'test'),
    ).rejects.toThrowError(BannedFromStreamError);
  });
});
