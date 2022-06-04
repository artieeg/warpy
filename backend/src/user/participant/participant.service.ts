import { BotInstanceEntity } from '@warpy-be/bots/bot-instance.entity';
import { MaxVideoStreamers } from '@warpy-be/errors';
import {
  EVENT_PARTICIPANT_LEAVE,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_STREAMER_MEDIA_TOGGLE,
} from '@warpy-be/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IFullParticipant, ParticipantStore } from './store';
import { ViewerService } from './viewer/viewer.service';
import { IJoinStreamResponse, Roles } from '@warpy/lib';
import { HostService } from './host/host.service';
import { StreamerService } from './streamer/streamer.service';

type StreamData = {
  streamers: IFullParticipant[];
  raisedHands: IFullParticipant[];
  count: number;
  host: string;
};

@Injectable()
export class ParticipantService {
  constructor(
    private participantStore: ParticipantStore,
    private botInstanceEntity: BotInstanceEntity,
    private eventEmitter: EventEmitter2,
    private viewerService: ViewerService,
    private hostService: HostService,
    private streamerService: StreamerService,
  ) {}

  /**
   * Returns stream's speakers, host, users with raised hands
   * and total amount of people on the stream
   * */
  async getStreamData(stream: string): Promise<StreamData> {
    const [speakers, raisedHands, count, host] = await Promise.all([
      this.participantStore.getStreamers(stream),
      this.participantStore.getRaisedHands(stream),
      this.participantStore.count(stream),
      this.hostService.getStreamHostId(stream),
    ]);

    return {
      streamers: speakers,
      raisedHands,
      count,
      host,
    };
  }

  async handleLeavingParticipant(user: string) {
    const data = await this.participantStore.get(user);

    if (!data) {
      return;
    }

    //ignore bots
    if (user.slice(0, 3) === 'bot') {
      return this.removeUserFromStream(user, data.stream);
    }

    //TODO: handle in store controller
    await this.participantStore.setDeactivated(user, data.stream, true);

    this.eventEmitter.emit(EVENT_PARTICIPANT_LEAVE, {
      user,
      stream: data.stream,
    });
  }

  /**
   * Determines if the user tries to join or rejoin the stream
   * In case the user tries to rejoin, sync their previous role
   * */
  async handleJoiningParticipant(
    user: string,
    stream: string,
  ): Promise<IJoinStreamResponse> {
    let response: IJoinStreamResponse;

    const [oldParticipantData, streamData] = await Promise.all([
      this.participantStore.get(user),
      this.getStreamData(stream),
    ]);

    const prevStreamId = oldParticipantData?.stream;

    response = { ...response, ...streamData };

    /**
     * if joining the stream
     * */
    if (!oldParticipantData || prevStreamId !== stream) {
      const { mediaPermissionsToken, recvMediaParams } =
        await this.viewerService.createNewViewer(stream, user);

      response = {
        ...response,
        mediaPermissionsToken,
        recvMediaParams,
        count: response.count + 1, //+1 since we are joining for the first time
        role: 'viewer',
      };

      return response;
    }

    /**
     * If rejoining...
     * */

    //TODO: handle in store controller
    await this.participantStore.setDeactivated(user, prevStreamId, false);

    /**
     * Based on the previous role, get viewer or streamer params
     * */
    const { role } = oldParticipantData;

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

    this.eventEmitter.emit(EVENT_PARTICIPANT_REJOIN, {
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
      return this.viewerService.reconnectOldViewer(user, stream);
    } else {
      return this.streamerService.reconnectOldStreamer(user, stream, role);
    }
  }

  async setMediaEnabled(
    user: string,
    {
      videoEnabled,
      audioEnabled,
    }: { videoEnabled?: boolean; audioEnabled?: boolean },
  ) {
    const stream = await this.participantStore.getStreamId(user);

    const update = {};

    if (audioEnabled !== undefined) {
      update['audioEnabled'] = audioEnabled;
    }

    if (videoEnabled !== undefined) {
      const activeVideoStreamers =
        await this.participantStore.countVideoStreamers(stream);

      //If the user tries to send video when there are already 4 video streamers...
      if (activeVideoStreamers >= 4 && videoEnabled === true) {
        throw new MaxVideoStreamers();
      }

      update['videoEnabled'] = videoEnabled;
    }

    await this.participantStore.update(user, update);

    this.eventEmitter.emit(EVENT_STREAMER_MEDIA_TOGGLE, {
      user,
      stream,
      videoEnabled,
      audioEnabled,
    });
  }

  async removeUserFromStream(user: string, stream?: string) {
    const isBot = user.slice(0, 3) === 'bot';

    let id = user;

    if (isBot) {
      const instance = await this.botInstanceEntity.getBotInstance(
        user,
        stream,
      );

      id = instance.id;
    }

    await this.deleteUserParticipant(id);

    this.eventEmitter.emit(EVENT_PARTICIPANT_LEAVE, {
      user,
      stream,
    });
  }

  private async deleteUserParticipant(user: string) {
    try {
      await this.participantStore.del(user);
    } catch (e) {
      console.error(e);
    }
  }

  async clearStreamData(stream: string) {
    return this.participantStore.clearStreamData(stream);
  }
}
