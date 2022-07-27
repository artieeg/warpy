import { EventEmitter2 } from '@nestjs/event-emitter';
import { BannedFromStreamError } from '@warpy-be/errors';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_REJOIN,
} from '@warpy-be/utils';
import { JoinStreamResponse, Roles } from '@warpy/lib';
import { MediaService } from '../media';
import { ParticipantService, ParticipantStore } from '../participant';
import { ParticipantKickerService } from '../participant-kicker';
import { HostService } from '../stream-host';
import { TokenService } from '../token';

/**
 * Joins/rejoins a participant, checks if the user has been banned
 * on stream, sets up user's media based on role
 * */
export class StreamJoinerService {
  constructor(
    private participantService: ParticipantService,
    private participantStore: ParticipantStore,
    private media: MediaService,
    private host: HostService,
    private tokenService: TokenService,
    private participantKicker: ParticipantKickerService,
    private events: EventEmitter2,
  ) {}

  async joinBot(bot: string, inviteToken: string) {
    const { stream } = this.tokenService.decodeToken(inviteToken);

    const botParticipant = await this.participantService.createBotParticipant(
      bot,
      stream,
    );

    const { id } = botParticipant;

    const {
      token: mediaPermissionToken,
      sendMediaParams,
      recvMediaParams,
    } = await this.media.getStreamerParams({
      user: id,
      roomId: stream,
      audio: true,
      video: true,
    });

    return {
      mediaPermissionToken,
      sendMediaParams,
      recvMediaParams,
    };
  }

  async joinUser(user: string, stream: string) {
    //check whether the user has been banned on stream
    if (await this.participantKicker.isUserKicked(user, stream)) {
      throw new BannedFromStreamError();
    }

    let response: JoinStreamResponse;

    const [previousParticipantData, streamData, host] = await Promise.all([
      this.participantStore.get(user),
      this.participantService.getParticipantDataOnStream(stream),
      this.host.getStreamHostId(stream),
    ]);

    const prevStreamId = previousParticipantData?.stream;

    response = {
      ...response,
      ...streamData,
      count: streamData.count + 1,
      host,
    };

    //if joining the stream
    if (!previousParticipantData || prevStreamId !== stream) {
      const [{ recvMediaParams, token: mediaPermissionsToken }, participant] =
        await Promise.all([
          this.media.getViewerParams(user, stream),
          this.participantService.createNewParticipant(stream, user),
        ]);

      this.events.emit(EVENT_NEW_PARTICIPANT, { participant });

      return {
        ...response,
        mediaPermissionsToken,
        recvMediaParams,
        role: 'viewer' as Roles,
      };
    }

    //If rejoining...

    await this.participantService.reactivateOldParticipant(
      previousParticipantData,
    );

    this.events.emit(EVENT_PARTICIPANT_REJOIN, {
      participant: previousParticipantData,
    });

    const { role } = previousParticipantData;

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
          : [...response.streamers, previousParticipantData],
    };

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
