import {
  BlockedByAnotherSpeaker,
  StreamHasBlockedSpeakerError,
} from '@warpy-be/errors';
import { ParticipantEntity } from '@warpy-be/participant/participant.entity';
import { mockedParticipantEntity } from '@warpy-be/participant/participant.entity.mock';
import { createParticipantFixture } from '@warpy-be/__fixtures__';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { NjsBlockStore } from './block.entity';
import { mockedBlockEntity } from './block.entity.mock';
import { NjsBlockService } from './block.service';

describe('BlockService', () => {
  let blockService: NjsBlockService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)
      .overrideProvider(NjsBlockStore)
      .useValue(mockedBlockEntity)
      .compile();

    blockService = m.get(NjsBlockService);
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
