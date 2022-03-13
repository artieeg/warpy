import {
  NoPermissionError,
  StreamNotFound,
  UserNotFound,
} from '@warpy-be/errors';
import { MediaService } from '@warpy-be/media/media.service';
import { mockedMediaService } from '@warpy-be/media/media.service.mock';
import { ParticipantEntity } from '@warpy-be/participant/participant.entity';
import { mockedParticipantEntity } from '@warpy-be/participant/participant.entity.mock';
import { UserEntity } from '@warpy-be/user/user.entity';
import { mockedUserEntity } from '@warpy-be/user/user.entity.mock';
import {
  createParticipantFixture,
  createStreamFixture,
} from '@warpy-be/__fixtures__';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { StreamEntity } from './stream.entity';
import { mockedStreamEntity } from './stream.entity.mock';
import { StreamService } from './stream.service';

describe('StreamService', () => {
  let streamService: StreamService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(ParticipantEntity)
      .useValue(mockedParticipantEntity)
      .overrideProvider(StreamEntity)
      .useValue(mockedStreamEntity)
      .overrideProvider(UserEntity)
      .useValue(mockedUserEntity)
      .overrideProvider(MediaService)
      .useValue(mockedMediaService)
      .compile();

    streamService = m.get(StreamService);
  });

  beforeEach(() => {
    mockedStreamEntity.create.mockResolvedValue(createStreamFixture({}));
  });

  it('throws if user does not exist', async () => {
    mockedUserEntity.findById.mockResolvedValueOnce(null);

    expect(
      streamService.createNewStream('test', 'test', 'test'),
    ).rejects.toThrowError(UserNotFound);
  });

  it('creates a new stream', async () => {
    const streamer = createParticipantFixture({});
    const stream = createStreamFixture({});
    const media = { data: 'test-media-data' };
    const recvMediaParams = { data: 'test-media-params' };
    const token = 'test-token';
    const streamerPermissions = { token };

    mockedParticipantEntity.create.mockResolvedValueOnce(streamer as any);
    mockedMediaService.getViewerParams.mockResolvedValueOnce(
      recvMediaParams as any,
    );
    mockedMediaService.createNewRoom.mockResolvedValueOnce(media as any);
    mockedMediaService.getStreamerPermissions.mockResolvedValueOnce(
      streamerPermissions as any,
    );

    const response = await streamService.createNewStream(
      'test',
      'test',
      'test',
    );
    expect(response).toStrictEqual({
      stream: stream.id,
      media,
      speakers: [streamer],
      count: 1,
      mediaPermissionsToken: token,
      recvMediaParams,
    });
  });

  it('stops stream if streamer', async () => {
    const streamerId = 'test-id';
    const stream = 'test-stream';

    const streamer = createParticipantFixture({
      id: streamerId,
      role: 'streamer',
      stream,
    });

    mockedParticipantEntity.getById.mockResolvedValueOnce(streamer as any);

    await streamService.stopStream(streamerId);

    expect(mockedStreamEntity.stop).toHaveBeenCalledWith(stream);
    expect(mockedParticipantEntity.allParticipantsLeave).toHaveBeenCalledWith(
      stream,
    );
  });

  it('checks if user exists when stopping it', async () => {
    mockedParticipantEntity.getById.mockResolvedValueOnce(null);

    expect(streamService.stopStream('test')).rejects.toThrowError(UserNotFound);
  });

  it('checks if stream exists when stopping it', async () => {
    const streamerId = 'test-id';

    const streamer = createParticipantFixture({
      id: streamerId,
      role: 'streamer',
      stream: null,
    });

    mockedParticipantEntity.getById.mockResolvedValueOnce(streamer as any);

    expect(streamService.stopStream(streamerId)).rejects.toThrowError(
      StreamNotFound,
    );
  });

  it('checks permission when stopping streams', async () => {
    const streamerId = 'test-id';
    const stream = 'test-stream';

    const streamer = createParticipantFixture({
      id: streamerId,
      role: 'viewer',
      stream,
    });

    mockedParticipantEntity.getById.mockResolvedValueOnce(streamer as any);

    expect(streamService.stopStream(streamerId)).rejects.toThrowError(
      NoPermissionError,
    );
  });

  it('sets preview clip', async () => {
    await streamService.setStreamPreview('test', 'preview');
    expect(mockedStreamEntity.setPreviewClip).toHaveBeenCalledWith(
      'test',
      'preview',
    );
  });
});
