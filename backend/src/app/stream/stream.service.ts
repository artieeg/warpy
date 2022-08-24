import { StreamNotFound } from '@warpy-be/errors';
import { EVENT_STREAM_CREATED, EVENT_STREAM_ENDED } from '@warpy-be/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewStreamResponse } from '@warpy/lib';
import cuid from 'cuid';
import { MediaService } from '@warpy-be/app/media';
import { StreamStore } from './stream.store';
import { BroadcastService } from '../broadcast';
import { ParticipantStore } from '../participant';

export class StreamService {
  constructor(
    private streamStore: StreamStore,
    private mediaService: MediaService,
    private events: EventEmitter2,
    private broadcastService: BroadcastService,
    private participantStore: ParticipantStore,
  ) {}

  async get(id: string) {
    const stream = await this.streamStore.findById(id);

    return stream;
  }

  async createNewStream(
    owner: string,
    title: string,
    category: string,
  ): Promise<NewStreamResponse> {
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

    this.events.emit(EVENT_STREAM_CREATED, {
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
    this.events.emit(EVENT_STREAM_ENDED, {
      stream,
    });
  }

  async stopStream(user: string): Promise<void> {
    const stream = await this.streamStore.delByHost(user);

    if (!stream) {
      throw new StreamNotFound();
    }

    const ids = await this.participantStore.getParticipantIds(stream);

    this.broadcastService.broadcast(ids, {
      event: 'stream-end',
      data: {
        stream,
      },
    });

    this.events.emit(EVENT_STREAM_ENDED, {
      stream: stream,
    });
  }

  async setStreamPreview(stream: string, preview: string) {
    await this.streamStore.setPreviewClip(stream, preview);
  }
}
