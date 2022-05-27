import { StreamNotFound } from '@warpy-be/errors';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_STREAM_CREATED,
  EVENT_STREAM_ENDED,
} from '@warpy-be/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { INewStreamResponse } from '@warpy/lib';
import cuid from 'cuid';
import { MediaService } from '../media/media.service';
import { StreamEntity } from './common/stream.entity';

@Injectable()
export class StreamService {
  constructor(
    private streamEntity: StreamEntity,
    private mediaService: MediaService,
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

    /*
    const { token, recvNodeId, sendNodeId } =
      await this.mediaService.getStreamerToken(owner, stream_id);
      */

    const stream = await this.streamEntity.create({
      id: stream_id,
      owner_id: owner,
      title,
      category,
      live: true,
      preview: null,
      reactions: 0,
    });

    //const media =
    await this.mediaService.createNewRoom({
      roomId: stream.id,
      host: owner,
    });

    const { token, recvMediaParams, sendMediaParams, recvNodeId, sendNodeId } =
      await this.mediaService.getStreamerParams({
        user: owner,
        roomId: stream.id,
      });

    /*
    const recvMediaParams = await this.mediaService.getViewerParams(
      recvNodeId,
      owner,
      stream.id,
    );
    */

    this.eventEmitter.emit(EVENT_STREAM_CREATED, {
      stream,
      hostNodeIds: {
        sendNodeId,
        recvNodeId,
      },
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
    await this.streamEntity.delete(stream);
    this.eventEmitter.emit(EVENT_STREAM_ENDED, {
      stream,
    });
  }

  async stopStream(user: string): Promise<void> {
    const stream = await this.streamEntity.deleteByHost(user);

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
