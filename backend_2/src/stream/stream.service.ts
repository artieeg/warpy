import { UserNotFound } from '@backend_2/errors';
import { Injectable } from '@nestjs/common';
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
  ) {}

  async createNewStream(
    owner: string,
    title: string,
    hub: string,
  ): Promise<INewStreamResponse> {
    const streamer = await this.userEntity.findById(owner);

    if (!streamer) {
      throw new UserNotFound();
    }

    const { recvNodeId, sendNodeId } =
      await this.mediaService.getSendRecvNodeIds();

    const participant = await this.participantEntity.create({
      user_id: owner,
      role: 'streamer',
      recvNodeId,
      sendNodeId,
    });

    const stream = await this.streamEntity.create({
      owner_id: owner,
      title,
      hub,
      live: true,
      preview: null,
      reactions: 0,
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
    }
  }

  async setStreamPreview(stream: string, preview: string) {
    await this.streamEntity.setPreviewClip(stream, preview);
  }
}
