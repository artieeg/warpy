import {
  NoPermissionError,
  StreamNotFound,
  UserNotFound,
} from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { INewStreamResponse } from '@warpy/lib';
import { MediaService } from '../media/media.service';
import { ParticipantEntity } from '../participant/participant.entity';
import { UserEntity } from '../user/user.entity';
import { StreamEntity } from './stream.entity';

@Injectable()
export class StreamService {
  constructor(
    private streamEntity: StreamEntity,
    private participantEntity: ParticipantEntity,
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

    const stream = await this.streamEntity.create({
      owner_id: owner,
      title,
      category,
      live: true,
      preview: null,
      reactions: 0,
    });

    const { recvNodeId, sendNodeId } =
      await this.mediaService.getSendRecvNodeIds(stream.id);

    const participant = await this.participantEntity.create({
      user_id: owner,
      role: 'streamer',
      recvNodeId,
      sendNodeId,
      audioEnabled: true,
      videoEnabled: true,
    });

    await this.participantEntity.setStream(participant.id, stream.id);

    const { token } = await this.mediaService.getStreamerPermissions(
      owner,
      stream.id,
      { recvNodeId, sendNodeId },
    );

    const media = await this.mediaService.createNewRoom({
      roomId: stream.id,
      host: owner,
    });

    const recvMediaParams = await this.mediaService.getViewerParams(
      participant.recvNodeId,
      owner,
      stream.id,
    );

    this.eventEmitter.emit('stream.created', { stream });

    return {
      stream: stream.id,
      media,
      speakers: [participant],
      count: 1,
      mediaPermissionsToken: token,
      recvMediaParams,
    };
  }

  async stopStream(user: string): Promise<void> {
    const participant = await this.participantEntity.getById(user);

    if (participant?.stream && participant?.role === 'streamer') {
      await this.streamEntity.stop(participant.stream);
      await this.participantEntity.allParticipantsLeave(participant.stream);
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
