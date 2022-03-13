import { MediaService } from '@warpy-be/media/media.service';
import { IFullParticipant, ParticipantStore } from '@warpy-be/user/participant';
import { TokenService } from '@warpy-be/token/token.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IBotJoinResponse } from '@warpy/lib';
import { BotInstanceEntity } from './bot-instance.entity';
import { EVENT_NEW_PARTICIPANT } from '@warpy-be/utils';

@Injectable()
export class BotInstanceService {
  constructor(
    private mediaService: MediaService,
    private tokenService: TokenService,
    private botInstanceEntity: BotInstanceEntity,
    private eventEmitter: EventEmitter2,
    private participantEntity: ParticipantStore,
  ) {}

  async createBotInstance(
    bot: string,
    invitationToken: string,
  ): Promise<IBotJoinResponse> {
    const { stream } = this.tokenService.decodeToken(invitationToken);

    const data = await this.botInstanceEntity.create(bot, stream);

    const {
      token: mediaPermissionToken,
      sendNodeId,
      recvNodeId,
    } = await this.mediaService.getBotToken(stream, data.id);

    const botParticipant: IFullParticipant = {
      ...data,
      stream,
      audioEnabled: false,
      videoEnabled: false,
      role: 'streamer',
      sendNodeId,
      recvNodeId,
      isBanned: false,
      isBot: true,
    };

    const [sendMedia, recvMedia] = await Promise.all([
      this.mediaService.createSendTransport({
        speaker: data.id,
        roomId: stream,
      }),
      this.mediaService.getViewerParams(recvNodeId, bot, stream),
      this.participantEntity.add(botParticipant),
    ]);

    this.eventEmitter.emit(EVENT_NEW_PARTICIPANT, {
      participant: botParticipant,
    });

    return {
      mediaPermissionToken,
      sendMedia,
      recvMedia,
    };
  }
}
