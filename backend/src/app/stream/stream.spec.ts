import { EventEmitter2 } from '@nestjs/event-emitter';
import { StreamNotFound } from '@warpy-be/errors';
import {
  EVENT_STREAM_CREATED,
  EVENT_STREAM_ENDED,
  getMockedInstance,
} from '@warpy-be/utils';
import {
  createStreamerParamsFixture,
  createStreamFixture,
} from '@warpy-be/__fixtures__';
import { when } from 'jest-when';
import { MediaService } from '../media';
import { StreamService } from './stream.service';
import { StreamStore } from './stream.store';

describe('StreamService', () => {
  const streamStore = getMockedInstance<StreamStore>(StreamStore);
  const mediaService = getMockedInstance<MediaService>(MediaService);
  const events = getMockedInstance<EventEmitter2>(EventEmitter2);

  const service = new StreamService(
    streamStore as any,
    mediaService as any,
    events as any,
  );

  describe('creating new room', () => {
    const title = 'hello world';
    const owner = 'user0';
    const category = 'cat0';

    const createdStream = createStreamFixture({
      title,
      category,
    });

    const streamerParams = createStreamerParamsFixture();

    streamStore.create.mockResolvedValue(createdStream);
    mediaService.getStreamerParams.mockResolvedValue(streamerParams as any);

    it('saves new stream record', async () => {
      await service.createNewStream(owner, title, category);

      expect(streamStore.create).toBeCalledWith(
        expect.objectContaining({
          title,
          category,
        }),
      );
    });

    it('creates media room', async () => {
      await service.createNewStream(owner, title, category);

      expect(mediaService.createNewRoom).toBeCalledWith({
        roomId: createdStream.id,
        host: owner,
      });
    });

    it('emits stream created event', async () => {
      await service.createNewStream(owner, title, category);

      expect(events.emit).toBeCalledWith(EVENT_STREAM_CREATED, {
        stream: createdStream,
      });
    });

    it('returns stream id, count and media connection params', async () => {
      expect(
        service.createNewStream(owner, title, category),
      ).resolves.toStrictEqual({
        stream: createdStream.id,
        count: 1,
        media: streamerParams.sendMediaParams,
        mediaPermissionsToken: streamerParams.token,
        recvMediaParams: streamerParams.recvMediaParams,
      });
    });
  });

  it('sets stream preview', async () => {
    await service.setStreamPreview('stream0', 'preview');

    expect(streamStore.setPreviewClip).toBeCalledWith('stream0', 'preview');
  });

  it('assigns new host', async () => {
    await service.setStreamHost('stream0', 'user0');

    expect(streamStore.setHost).toBeCalledWith('stream0', 'user0');
  });

  it('deletes streams', async () => {
    await service.deleteStream('stream');

    expect(streamStore.del).toBeCalledWith('stream');
    expect(events.emit).toBeCalledWith(EVENT_STREAM_ENDED, {
      stream: 'stream',
    });
  });

  describe('stopping streams', () => {
    const validHost = 'host0';
    const invalidHost = 'host1';

    const deletedStream = createStreamFixture({ owner: validHost });

    when(streamStore.delByHost)
      .calledWith(validHost)
      .mockResolvedValue(deletedStream.id);

    when(streamStore.delByHost).calledWith(invalidHost).mockResolvedValue(null);

    it('throws when host is invalid', async () => {
      expect(service.stopStream(invalidHost)).rejects.toThrowError(
        StreamNotFound,
      );
    });

    it('emits stream end event', async () => {
      await service.stopStream(validHost);

      expect(events.emit).toBeCalledWith(EVENT_STREAM_ENDED, {
        stream: deletedStream.id,
      });
    });
  });
});
