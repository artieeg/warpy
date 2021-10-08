import {
  BlockedByAnotherSpeaker,
  StreamHasBlockedSpeakerError,
} from '@backend_2/errors';
import { ParticipantEntity } from '@backend_2/participant/participant.entity';
import { mockedParticipantEntity } from '@backend_2/participant/participant.entity.mock';
import { createParticipantFixture } from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { BlockEntity } from './block.entity';
import { mockedBlockEntity } from './block.entity.mock';
import { BlockService } from './block.service';

describe('BlockService', () => {
  let blockService: BlockService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)
      .overrideProvider(BlockEntity)
      .useValue(mockedBlockEntity)
      .compile();

    blockService = m.get(BlockService);
  });

  it('blocks user', async () => {
    const blockId = 'test';

    mockedBlockEntity.create.mockResolvedValueOnce(blockId);

    expect(blockService.blockUser('id0', 'id1')).resolves.toEqual(blockId);
  });

  it('checks if a user has been banned by another speaker', async () => {
    const speakerId = 'test';
    const speakers = [
      createParticipantFixture({ role: 'speaker', id: speakerId }),
    ];
    mockedParticipantEntity.getSpeakers.mockResolvedValueOnce(speakers);
    mockedBlockEntity.getBlockedByIds.mockResolvedValueOnce([speakerId]);

    expect(blockService.isBannedBySpeaker('id1', 'id2')).rejects.toThrowError(
      BlockedByAnotherSpeaker,
    );
  });

  it('checks if a user has another speaker banned', async () => {
    const speakerId = 'test';
    const speakers = [
      createParticipantFixture({ role: 'speaker', id: speakerId }),
    ];
    mockedParticipantEntity.getSpeakers.mockResolvedValueOnce(speakers);
    mockedBlockEntity.getBlockedUserIds.mockResolvedValueOnce([speakerId]);

    expect(blockService.isBannedBySpeaker('id1', 'id2')).rejects.toThrowError(
      StreamHasBlockedSpeakerError,
    );
  });
});
