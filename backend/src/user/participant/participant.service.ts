import { NjsBotInstanceStore } from '@warpy-be/bots/bot-instance.entity';
import { MaxVideoStreamers } from '@warpy-be/errors';
import {
  EVENT_PARTICIPANT_REJOIN,
  EVENT_STREAMER_MEDIA_TOGGLE,
} from '@warpy-be/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NjsParticipantStore } from './store';
import { ViewerService } from './viewer/viewer.service';
import { IJoinStreamResponse, Roles } from '@warpy/lib';
import { NjsHostService } from './host/host.service';
import { StreamerService } from './streamer/streamer.service';
import { ParticipantService } from 'lib/services/participant';

@Injectable()
export class NjsParticipantService extends ParticipantService {
  constructor(
    private participantStore: NjsParticipantStore,
    botInstanceStore: NjsBotInstanceStore,
    private events: EventEmitter2,
    private viewerService: ViewerService,
    hostService: NjsHostService,
    private streamerService: StreamerService,
  ) {
    super(participantStore, hostService, botInstanceStore, events);
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
      this.getParticipantDataOnStream(stream),
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
        count: response.count + 1, //+1 because we are joining
        role: 'viewer',
      };

      return response;
    }

    /**
     * If rejoining...
     * */

    //TODO: handle in store controller
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

    this.events.emit(EVENT_STREAMER_MEDIA_TOGGLE, {
      user,
      stream,
      videoEnabled,
      audioEnabled,
    });
  }
}
