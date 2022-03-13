import { BlockEntity } from '@warpy-be/block/block.entity';
import { mockedBlockEntity } from '@warpy-be/block/block.entity.mock';
import { ParticipantEntity } from '@warpy-be/participant/participant.entity';
import { mockedParticipantEntity } from '@warpy-be/participant/participant.entity.mock';
import { StreamEntity } from '@warpy-be/stream/stream.entity';
import { mockedStreamEntity } from '@warpy-be/stream/stream.entity.mock';
import {
  createParticipantFixture,
  createStreamFixture,
} from '@warpy-be/__fixtures__';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { CandidateService } from './candidate.service';

describe('FeedService', () => {
  let feedService: CandidateService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)
      .overrideProvider(StreamEntity)
      .useValue(mockedStreamEntity)
      .overrideProvider(BlockEntity)
      .useValue(mockedBlockEntity)
      .compile();

    feedService = m.get(CandidateService);
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
