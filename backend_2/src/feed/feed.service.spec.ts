import { BlockEntity } from '@backend_2/block/block.entity';
import { mockedBlockEntity } from '@backend_2/block/block.entity.mock';
import { ParticipantEntity } from '@backend_2/participant/participant.entity';
import { mockedParticipantEntity } from '@backend_2/participant/participant.entity.mock';
import { StreamEntity } from '@backend_2/stream/stream.entity';
import { mockedStreamEntity } from '@backend_2/stream/stream.entity.mock';
import {
  createParticipantFixture,
  createStreamFixture,
} from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { FeedService } from './feed.service';

describe('FeedService', () => {
  let feedService: FeedService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)
      .overrideProvider(StreamEntity)
      .useValue(mockedStreamEntity)
      .overrideProvider(BlockEntity)
      .useValue(mockedBlockEntity)
      .compile();

    feedService = m.get(FeedService);
  });

  it('gets feed', async () => {
    const speakers = [createParticipantFixture({ role: 'speaker' })];
    const blockedUserIds = ['id1', 'id2'];
    const blockedByUserIds = ['id3', 'id4'];
    const streams = [createStreamFixture({})];

    mockedStreamEntity.get.mockResolvedValueOnce(streams);
    mockedParticipantEntity.count.mockResolvedValueOnce(5);
    mockedParticipantEntity.getSpeakers.mockResolvedValueOnce(speakers);

    mockedBlockEntity.getBlockedByIds.mockResolvedValueOnce(blockedByUserIds);
    mockedBlockEntity.getBlockedUserIds.mockResolvedValueOnce(blockedUserIds);

    const feed = await feedService.getFeed('id5');

    expect(mockedStreamEntity.get).toBeCalledWith({
      blockedByUserIds,
      blockedUserIds,
    });

    expect(feed.length).toEqual(streams.length);
  });
});
