import { StreamNotFound } from '@warpy-be/errors';
import { EVENT_STREAM_CREATED, EVENT_STREAM_ENDED } from '@warpy-be/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { INewStreamResponse } from '@warpy/lib';
import cuid from 'cuid';
import { MediaService } from 'lib/media';
import { StreamStore } from './stream.store';

export class StreamService {
  constructor(
    private streamStore: StreamStore,
    private mediaService: MediaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async get(id: string) {
    const stream = await this.streamStore.findById(id);

    return stream;
  }

  async createNewStream(
    owner: string,
    title: string,
    category: string,
  ): Promise<INewStreamResponse> {
    const stream_id = cuid();
    const stream = await this.streamStore.create({
      id: stream_id,
      owner_id: owner,
      title,
      category,
      live: true,
      preview: null,
      reactions: 0,
    });

    await this.mediaService.createNewRoom({
      roomId: stream.id,
      host: owner,
    });

    const { token, recvMediaParams, sendMediaParams } =
      await this.mediaService.getStreamerParams({
        user: owner,
        roomId: stream.id,
        audio: true,
        video: true,
      });

    this.eventEmitter.emit(EVENT_STREAM_CREATED, {
      stream,
    });

    return {
      stream: stream.id,
      media: sendMediaParams,
      count: 1,
      mediaPermissionsToken: token,
      recvMediaParams,
    };
  }

  async setStreamHost(stream: string, host: string) {
    return this.streamStore.setHost(stream, host);
  }

  async deleteStream(stream: string) {
    await this.streamStore.del(stream);
    this.eventEmitter.emit(EVENT_STREAM_ENDED, {
      stream,
    });
  }

  async stopStream(user: string): Promise<void> {
    const stream = await this.streamStore.delByHost(user);

    if (!stream) {
      throw new StreamNotFound();
    }

    this.eventEmitter.emit(EVENT_STREAM_ENDED, {
      stream: stream,
    });
  }

  async setStreamPreview(stream: string, preview: string) {
    await this.streamStore.setPreviewClip(stream, preview);
  }
}
