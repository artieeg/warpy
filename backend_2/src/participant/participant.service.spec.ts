import { BannedFromStreamError } from '@backend_2/errors';
import { createUserFixture } from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { MediaService } from '../media/media.service';
import { StreamBlockService } from '../stream-block/stream-block.service';
import { ParticipantEntity } from './participant.entity';
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

const mockedParticipantEntity = {
  create: jest.fn(),
  getSpeakers: jest.fn(),
  getWithRaisedHands: jest.fn(),
  count: jest.fn(),
  getIdsByStream: jest.fn(),
};

describe('ParticipantService', () => {
  let participantService: ParticipantService;

  const stream = 'test-stream';
  const user = 'test-user';

  const count = 120;
  const speakers = [createUserFixture({})];
  const raisedHands = [createUserFixture({})];
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
});
