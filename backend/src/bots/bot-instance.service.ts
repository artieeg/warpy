import { MediaService } from '@backend_2/media/media.service';
import { ParticipantEntity } from '@backend_2/user/participant/common/participant.entity';
import { TokenService } from '@backend_2/token/token.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IBotJoinResponse } from '@warpy/lib';
import { BotInstanceEntity } from './bot-instance.entity';

@Injectable()
export class BotInstanceService {
  constructor(
    private mediaService: MediaService,
    private tokenService: TokenService,
    private botInstanceEntity: BotInstanceEntity,
    private eventEmitter: EventEmitter2,
    private participantEntity: ParticipantEntity,
  ) {}

  async createBotInstance(
    bot: string,
    invitationToken: string,
  ): Promise<IBotJoinResponse> {
    const { stream } = this.tokenService.decodeToken(invitationToken);
    const nodes = await this.mediaService.getSendRecvNodeIds(stream);

    const botInstanceId = await this.botInstanceEntity.create(bot, stream);

    const botParticipant = await this.participantEntity.create({
      bot_id: botInstanceId,
      stream,
      audioEnabled: false,
      videoEnabled: false,
      role: 'streamer',
      ...nodes,
    });

    const mediaPermissionToken = this.mediaService.createPermissionToken({
      room: stream,
      user: botInstanceId,
      audio: true,
      video: true,
      ...nodes,
    });

    const [sendMedia, recvMedia] = await Promise.all([
      this.mediaService.createSendTransport({
        speaker: botInstanceId,
        roomId: stream,
      }),
      this.mediaService.getViewerParams(nodes.recvNodeId, bot, stream),
    ]);

    this.eventEmitter.emit('participant.new', botParticipant);

    return {
      mediaPermissionToken,
      sendMedia,
      recvMedia,
    };
  }
}
