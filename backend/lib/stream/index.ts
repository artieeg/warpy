import { StreamNotFound } from '@warpy-be/errors';
import { EVENT_STREAM_CREATED, EVENT_STREAM_ENDED } from '@warpy-be/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { INewStreamResponse, IStream } from '@warpy/lib';
import cuid from 'cuid';
import { IStreamStore, IMediaService } from 'lib';

export interface IStreamService {
  get(id: string): Promise<IStream>;
  createNewStream(
    owner: string,
    title: string,
    category: string,
  ): Promise<INewStreamResponse>;
  setStreamHost(stream: string, host: string): Promise<void>;
  deleteStream(stream: string): Promise<void>;
  stopStream(user: string): Promise<void>;
  setStreamPreview(stream: string, preview: string): Promise<void>;
}

export class StreamService implements IStreamService {
  constructor(
    private streamEntity: IStreamStore,
    private mediaService: IMediaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async get(id: string) {
    const stream = await this.streamEntity.findById(id);

    return stream;
  }

  async createNewStream(
    owner: string,
    title: string,
    category: string,
  ): Promise<INewStreamResponse> {
    const stream_id = cuid();
    const stream = await this.streamEntity.create({
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
    return this.streamEntity.setHost(stream, host);
  }

  async deleteStream(stream: string) {
    await this.streamEntity.del(stream);
    this.eventEmitter.emit(EVENT_STREAM_ENDED, {
      stream,
    });
  }

  async stopStream(user: string): Promise<void> {
    const stream = await this.streamEntity.delByHost(user);

    if (!stream) {
      throw new StreamNotFound();
    }

    this.eventEmitter.emit(EVENT_STREAM_ENDED, {
      stream: stream,
    });
  }

  async setStreamPreview(stream: string, preview: string) {
    await this.streamEntity.setPreviewClip(stream, preview);
  }
}
