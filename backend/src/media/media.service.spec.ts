import { InternalError } from '@warpy-be/errors';
import { NjsNatsService } from '@warpy-be/nats/nats.service';
import { mockedNatsService } from '@warpy-be/nats/nats.services.mock';
import { createParticipantFixture } from '@warpy-be/__fixtures__';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { MediaCacheService } from './media.cache';
import { mockedMediaCache } from './media.cache.mock';
import { NjsMediaService } from './media.service';

describe('MediaService', () => {
  let mediaService: NjsMediaService;

  const sendNodeId = 'send-node-id';
  const recvNodeId = 'recv-node-id';

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(NjsNatsService)
      .useValue(mockedNatsService)
      .overrideProvider(MediaCacheService)
      .useValue(mockedMediaCache)
      .compile();

    mediaService = m.get(NjsMediaService);

    mockedNatsService.request.mockResolvedValue({ status: 'ok' });
    mockedMediaCache.getConsumerNodeId.mockResolvedValue(recvNodeId);
    mockedMediaCache.getProducerNodeId.mockResolvedValue(sendNodeId);
  });

  it('creates new room', async () => {
    const newRoomData = { data: 'test' };
    mockedNatsService.request.mockResolvedValueOnce(newRoomData);

    expect(
      mediaService.createNewRoom({ test: 'test' } as any),
    ).resolves.toStrictEqual(newRoomData);
  });

  it('returns params to connect new transport', async () => {
    const speakerMediaParams = { data: 'test' };
    mockedNatsService.request.mockResolvedValueOnce(speakerMediaParams);

    expect(
      mediaService.createSendTransport({ test: 'test' } as any),
    ).resolves.toStrictEqual(speakerMediaParams);
  });

  it('returns params to connect viewer', async () => {
    const viewerMediaParams = { data: 'test' };
    mockedNatsService.request.mockResolvedValueOnce(viewerMediaParams);

    expect(
      mediaService.getViewerParams(recvNodeId, 'user', 'stream'),
    ).resolves.toStrictEqual(viewerMediaParams);
  });

  it('returns recv node id', async () => {
    expect(mediaService.getRecvNodeId()).resolves.toEqual(recvNodeId);
  });

  it('returns send node id', async () => {
    expect(mediaService.getSendNodeId()).resolves.toEqual(sendNodeId);
  });

  it('returns send/recv node ids', async () => {
    expect(mediaService.getSendRecvNodeIds()).resolves.toEqual({
      sendNodeId,
      recvNodeId,
    });
  });

  it.each([undefined, {}, { recvNodeId }, { sendNodeId }])(
    'picks send/recv nodes for a streamer automatically if they arent provided',
    async (option) => {
      expect(
        mediaService.getStreamerPermissions('user', 'room', option),
      ).resolves.toStrictEqual({
        token: expect.anything(),
        permissions: expect.objectContaining({
          recvNodeId: option?.recvNodeId || recvNodeId,
          sendNodeId: option?.sendNodeId || sendNodeId,
        }),
      });
    },
  );

  it('picks send/recv nodes for a speaker automatically if they arent provided', async () => {
    const options = [undefined, {}, { recvNodeId }, { sendNodeId }];

    options.forEach((option) => {
      expect(
        mediaService.getSpeakerPermissions('user', 'room', option),
      ).resolves.toStrictEqual({
        token: expect.anything(),
        permissions: expect.objectContaining({
          recvNodeId: option?.recvNodeId || recvNodeId,
          sendNodeId: option?.sendNodeId || sendNodeId,
        }),
      });
    });
  });

  it('creates viewer permissions', async () => {
    expect(mediaService.getViewerToken('test', 'test2')).resolves.toStrictEqual(
      {
        token: expect.anything(),
        permissions: expect.objectContaining({
          recvNodeId,
          user: 'test',
          room: 'test2',
        }),
      },
    );
  });

  it('adds new media node', async () => {
    await mediaService.addNewMediaNode('id', 'CONSUMER');

    expect(mockedMediaCache.addNewNode).toBeCalledWith('id', 'CONSUMER');
  });

  it('removes participant from the room', async () => {
    const participants = [
      createParticipantFixture({ recvNodeId, sendNodeId }),
      createParticipantFixture({ recvNodeId, sendNodeId: null }),
      createParticipantFixture({ sendNodeId: null, recvNodeId: null }),
    ];

    await Promise.all(
      participants.map(async (p) => {
        await mediaService.removeFromNodes(p);

        if (p.recvNodeId) {
          expect(mockedNatsService.request).toBeCalledWith(
            `media.peer.user-leave.${recvNodeId}`,
            expect.anything(),
            expect.anything(),
          );
        }

        if (p.sendNodeId) {
          expect(mockedNatsService.request).toBeCalledWith(
            `media.peer.user-leave.${sendNodeId}`,
            expect.anything(),
            expect.anything(),
          );
        }
      }),
    );
  });

  it('throws internal error if media service failed to remove user', async () => {
    const participant = createParticipantFixture({
      recvNodeId: 'test',
      sendNodeId: null,
    });

    mockedNatsService.request.mockResolvedValueOnce({ status: 'error' });

    expect(mediaService.removeFromNodes(participant)).rejects.toThrowError(
      InternalError,
    );
  });

  it("tells media services to remove user' producers", async () => {
    const user = 'test0';
    const producers = { video: true };
    const node = 'node0';
    const stream = 'test';

    await mediaService.removeUserProducers(user, node, stream, producers);

    expect(mockedNatsService.publish).toBeCalledWith(
      `media.peer.remove-producers.${node}`,
      expect.anything(),
    );
  });
});
