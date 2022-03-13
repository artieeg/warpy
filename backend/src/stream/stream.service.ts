import {
  NoPermissionError,
  StreamNotFound,
  UserNotFound,
} from '@warpy-be/errors';
import {
  IFullParticipant,
  ParticipantStore,
} from '@warpy-be/user/participant/store';
import { EVENT_NEW_PARTICIPANT, EVENT_STREAM_ENDED } from '@warpy-be/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { INewStreamResponse } from '@warpy/lib';
import cuid from 'cuid';
import { MediaService } from '../media/media.service';
import { UserEntity } from '../user/user.entity';
import { StreamEntity } from './common/stream.entity';

@Injectable()
export class StreamService {
  constructor(
    private streamEntity: StreamEntity,
    private participantStore: ParticipantStore,
    private userEntity: UserEntity,
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
    const streamer = await this.userEntity.findById(owner);

    if (!streamer) {
      throw new UserNotFound();
    }

    const stream_id = cuid();

    const { token, recvNodeId, sendNodeId } =
      await this.mediaService.getHostToken(owner, stream_id);

    const stream = await this.streamEntity.create({
      id: stream_id,
      owner_id: owner,
      title,
      category,
      live: true,
      preview: null,
      reactions: 0,
    });

    const host: IFullParticipant = {
      ...streamer,
      role: 'streamer',
      recvNodeId,
      sendNodeId,
      audioEnabled: true,
      videoEnabled: true,
      isBanned: false,
      stream: stream_id,
      isBot: false,
    };

    await this.participantStore.add(host);

    const media = await this.mediaService.createNewRoom({
      roomId: stream.id,
      host: owner,
    });

    const recvMediaParams = await this.mediaService.getViewerParams(
      host.recvNodeId,
      owner,
      stream.id,
    );

    this.eventEmitter.emit('stream.created', { stream });
    this.eventEmitter.emit(EVENT_NEW_PARTICIPANT, { participant: host });

    return {
      stream: stream.id,
      media,
      speakers: [host],
      count: 1,
      mediaPermissionsToken: token,
      recvMediaParams,
    };
  }

  async stopStream(user: string): Promise<void> {
    const participant = await this.participantStore.get(user);

    console.log({ participant });

    if (participant?.stream && participant?.role === 'streamer') {
      await this.streamEntity.delete(participant.stream);
      await this.participantStore.clearStreamData(participant.stream);

      this.eventEmitter.emit(EVENT_STREAM_ENDED, {
        stream: participant.stream,
      });
    } else if (!participant) {
      throw new UserNotFound();
    } else if (!participant.stream) {
      throw new StreamNotFound();
    } else {
      throw new NoPermissionError();
    }
  }

  async setStreamPreview(stream: string, preview: string) {
    await this.streamEntity.setPreviewClip(stream, preview);
  }
}
