import { BannedFromStreamError } from '@backend_2/errors';
import { mockedEventEmitter } from '@backend_2/events/events.service.mock';
import { createParticipantFixture } from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MediaService } from '../media/media.service';
import { StreamBlockService } from '../stream-block/stream-block.service';
import { ParticipantEntity } from './participant.entity';
import { mockedParticipantEntity } from './participant.entity.mock';
import { ParticipantService } from './participant.service';

const mockedMediaService = {
  getViewerPermissions: jest.fn().mockResolvedValue({
    token: 'test',
    permissions: {
      test: true,
    },
  }),
  getViewerParams: jest.fn(),
};

const mockedStreamBlock = {
  checkUserBanned: jest.fn(),
};

describe('ParticipantService', () => {
  let participantService: ParticipantService;

  const stream = 'test-stream';
  const user = 'test-user';

  const count = 120;
  const speakers = [createParticipantFixture({ role: 'speaker' })];
  const raisedHands = [
    createParticipantFixture({
      role: 'viewer',
      isRaisingHand: true,
    }),
  ];
  const mediaPermissionsToken = 'test';
  const recvMediaParams = { test: true };

  const streamParticipants = ['id1', 'id2'];

  beforeAll(async () => {
    const moduleRef = await testModuleBuilder
      .overrideProvider(StreamBlockService)
      .useValue(mockedStreamBlock)
      .overrideProvider(MediaService)
      .useValue(mockedMediaService)
      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)
      .overrideProvider(EventEmitter2)
      .useValue(mockedEventEmitter)
      .compile();

    participantService = moduleRef.get(ParticipantService);

    mockedParticipantEntity.getWithRaisedHands.mockResolvedValue(raisedHands);
    mockedParticipantEntity.count.mockResolvedValue(count);
    mockedParticipantEntity.getSpeakers.mockResolvedValue(speakers);

    mockedMediaService.getViewerParams.mockResolvedValue(recvMediaParams);
    mockedParticipantEntity.getIdsByStream.mockResolvedValue(
      streamParticipants,
    );
  });

  it('checks if new viewer is banned', () => {
    mockedStreamBlock.checkUserBanned.mockRejectedValueOnce(
      new BannedFromStreamError(),
    );

    expect(
      participantService.createNewViewer(stream, user),
    ).rejects.toThrowError(BannedFromStreamError);
  });

  it('adds new viewer', () => {
    expect(participantService.createNewViewer(stream, user)).resolves.toEqual({
      speakers,
      raisedHands,
      count,
      mediaPermissionsToken,
      recvMediaParams,
    });
  });

  it('returns stream participants', () => {
    expect(participantService.getStreamParticipants('test')).resolves.toEqual(
      streamParticipants,
    );
  });

  it('emits participant.delete event when a participant has been deleted', async () => {
    const user = 'test';
    const stream = 'test2';

    mockedParticipantEntity.getCurrentStreamFor.mockResolvedValue(stream);

    await participantService.deleteParticipant(user);

    expect(mockedEventEmitter.emit).toBeCalledWith('participant.delete', {
      user,
      stream,
    });
  });

  it('deletes a participant', async () => {
    const stream = 'test2';
    const user = 'user';

    mockedParticipantEntity.getCurrentStreamFor.mockResolvedValue(stream);
    await participantService.deleteParticipant(user);

    expect(mockedParticipantEntity.deleteParticipant).toHaveBeenCalledWith(
      user,
    );
  });

  it('fetches viewers page', async () => {
    const stream = 'stream';
    const page = 4;

    const viewers = [createParticipantFixture({ stream, role: 'viewer' })];

    mockedParticipantEntity.getViewersPage.mockResolvedValue(viewers);

    expect(participantService.getViewers(stream, page)).resolves.toStrictEqual(
      viewers,
    );
  });
});
