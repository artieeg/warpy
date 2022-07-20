import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_REJOIN,
} from '@warpy-be/utils';
import {
  IBotJoinResponse,
  IJoinStreamResponse,
  IParticipant,
  Roles,
} from '@warpy/lib';
import { IParticipantStore } from 'lib/stores';
import { BotInstanceService } from '../bot-instance';
import { IMediaService } from '../media';
import { IParticipantService } from '../participant';
import { IStreamBanService } from '../stream-bans';
import { HostService } from '../stream-host';
import { TokenService } from '../token';

export interface IStreamJoiner {
  join(user: string, stream: string): Promise<IJoinStreamResponse>;
  joinBot(bot: string, inviteToken: string): Promise<IBotJoinResponse>;
}

/**
 * Joins/rejoins a participant, checks if the user has been banned
 * on stream, sets up user's media based on role
 * */
export class StreamJoiner implements IStreamJoiner {
  constructor(
    private participant: IParticipantService,
    private participantStore: IParticipantStore,
    private botInstanceService: BotInstanceService,
    private events: EventEmitter2,
    private bans: IStreamBanService,
    private media: IMediaService,
    private host: HostService,
    private tokenService: TokenService,
  ) {}

  async joinBot(bot: string, inviteToken: string) {
    const { stream } = this.tokenService.decodeToken(inviteToken);
    const botInstance = await this.botInstanceService.createBotInstance(
      bot,
      inviteToken,
    );

    const { token: mediaPermissionToken } = await this.media.getBotToken(
      stream,
      botInstance.id,
    );

    const botParticipant: IParticipant = {
      ...botInstance,
      stream,
      audioEnabled: false,
      videoEnabled: false,
      role: 'streamer',
      isBanned: false,
      isBot: true,
    };

    const [sendMedia, recvMedia] = await Promise.all([
      this.media.createSendTransport({
        speaker: botInstance.id,
        roomId: stream,
      }),
      this.media.getBotParams(bot, stream),
      this.participantStore.add(botParticipant),
    ]);

    this.events.emit(EVENT_NEW_PARTICIPANT, {
      participant: botParticipant,
    });

    return {
      mediaPermissionToken,
      sendMedia,
      recvMedia,
    };
  }

  async join(user: string, stream: string) {
    //check whether the user has been banned on stream
    await this.bans.checkUserBanned(user, stream);

    let response: IJoinStreamResponse;

    const [oldParticipantData, streamData, host] = await Promise.all([
      this.participantStore.get(user),
      this.participant.getParticipantDataOnStream(stream),
      this.host.getStreamHostId(stream),
    ]);

    const prevStreamId = oldParticipantData?.stream;

    response = { ...response, ...streamData, host };

    /**
     * if joining the stream
     * */
    if (!oldParticipantData || prevStreamId !== stream) {
      const { mediaPermissionsToken, recvMediaParams } =
        await this.participant.createNewParticipant(stream, user); //move to ParticipantCreator

      response = {
        ...response,
        mediaPermissionsToken,
        recvMediaParams,
        count: response.count + 1, //+1 because we are joining
        role: 'viewer',
      };

      return response;
    }

    /**
     * If rejoining...
     * */

    await this.participantStore.setDeactivated(user, prevStreamId, false);

    const { role } = oldParticipantData;

    /**
     * Based on the previous role, get viewer or streamer params
     * */
    const reconnectMediaParams = await this.getReconnectMediaParams({
      user,
      stream,
      role,
    });

    /**
     * Merge token, send/recv params into the response,
     * if we are streaming audio/video, then
     * include us in the streamers array
     * */
    response = {
      ...response,
      ...reconnectMediaParams,
      role,
      streamers:
        role === 'viewer'
          ? response.streamers
          : [...response.streamers, oldParticipantData],
    };

    this.events.emit(EVENT_PARTICIPANT_REJOIN, {
      participant: oldParticipantData,
    });

    return response;
  }

  /**
   * Returns recv + send params and media permissions token
   * */
  private async getReconnectMediaParams({
    user,
    stream,
    role,
  }: {
    user: string;
    stream: string;
    role: Roles;
  }) {
    if (role === 'viewer') {
      const { token: mediaPermissionsToken, recvMediaParams } =
        await this.media.getViewerParams(user, stream);

      return { mediaPermissionsToken, recvMediaParams };
    } else {
      const { token: mediaPermissionsToken, recvMediaParams } =
        await this.media.getStreamerParams({
          user,
          roomId: stream,
          audio: true,
          video: role === 'streamer',
        });

      return { mediaPermissionsToken, recvMediaParams };
    }
  }
}
