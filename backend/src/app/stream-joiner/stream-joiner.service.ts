import { EventEmitter2 } from '@nestjs/event-emitter';
import { BannedFromStreamError } from '@warpy-be/errors';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_REJOIN,
} from '@warpy-be/utils';
import { IJoinStreamResponse, IParticipant, Roles } from '@warpy/lib';
import { ParticipantStore } from '@warpy-be/app';
import { BotInstanceService } from '../bot-instance';
import { MediaService } from '../media';
import { ParticipantService } from '../participant';
import { HostService } from '../stream-host';
import { TokenService } from '../token';

/**
 * Joins/rejoins a participant, checks if the user has been banned
 * on stream, sets up user's media based on role
 * */
export class StreamJoinerService {
  constructor(
    private participant: ParticipantService,
    private participantStore: ParticipantStore,
    private botInstanceService: BotInstanceService,
    private events: EventEmitter2,
    private media: MediaService,
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
    if (await this.participant.isUserBanned(user, stream)) {
      throw new BannedFromStreamError();
    }

    let response: IJoinStreamResponse;

    const [oldParticipantData, streamData, host] = await Promise.all([
      this.participantStore.get(user),
      this.participant.getParticipantDataOnStream(stream),
      this.host.getStreamHostId(stream),
    ]);

    const prevStreamId = oldParticipantData?.stream;

    response = {
      ...response,
      ...streamData,
      count: streamData.count + 1,
      host,
    };

    //if joining the stream
    if (!oldParticipantData || prevStreamId !== stream) {
      const { mediaPermissionsToken, recvMediaParams } =
        await this.participant.createNewParticipant(stream, user);

      return {
        ...response,
        mediaPermissionsToken,
        recvMediaParams,
        role: 'viewer' as Roles,
      };
    }

    //If rejoining...

    //Reactivate user, the user will be considered a stream participant again
    await this.participantStore.setDeactivated(user, prevStreamId, false);

    const { role } = oldParticipantData;

    //Based on the previous role, get viewer or streamer params
    const reconnectMediaParams = await this.getMediaParamsForRole({
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
   * Depending on user's role, returns
   * media permissions token, recv media params
   * and send media params (if streamer)
   * */
  private async getMediaParamsForRole({
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
