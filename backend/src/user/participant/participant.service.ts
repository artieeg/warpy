import { BotInstanceEntity } from '@warpy-be/bots/bot-instance.entity';
import { MaxVideoStreamers } from '@warpy-be/errors';
import { MediaService } from '@warpy-be/media/media.service';
import {
  EVENT_PARTICIPANT_LEAVE,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_STREAMER_MEDIA_TOGGLE,
} from '@warpy-be/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IFullParticipant, ParticipantStore } from './store';
import { ViewerService } from './viewer/viewer.service';
import { IJoinStreamResponse } from '@warpy/lib';
import { HostService } from './host/host.service';

type StreamData = {
  streamers: IFullParticipant[];
  raisedHands: IFullParticipant[];
  count: number;
  host: string;
};

@Injectable()
export class ParticipantService {
  constructor(
    private participant: ParticipantStore,
    private botInstanceEntity: BotInstanceEntity,
    private media: MediaService,
    private eventEmitter: EventEmitter2,
    private viewerService: ViewerService,
    private hostService: HostService,
  ) {}

  /**
   * Returns stream's speakers, host, users with raised hands
   * and total amount of people on the stream
   * */
  async getStreamData(stream: string): Promise<StreamData> {
    const [speakers, raisedHands, count, host] = await Promise.all([
      this.participant.getStreamers(stream),
      this.participant.getRaisedHands(stream),
      this.participant.count(stream),
      this.hostService.getStreamHostId(stream),
    ]);

    return {
      streamers: speakers,
      raisedHands,
      count,
      host,
    };
  }

  /**
   * Determines if the user tries to join or rejoin the stream
   * In case the user tries to rejoin, sync their previous role
   * */
  async createNewParticipant(
    user: string,
    stream: string,
  ): Promise<IJoinStreamResponse> {
    let response: IJoinStreamResponse;

    //Check if the record already exists
    const data = await this.participant.get(user);

    const streamData = await this.getStreamData(stream);

    response = { ...response, ...streamData, count: streamData.count + 1 };

    //If the user is not rejoining, join as a viewer
    if (data?.stream !== stream) {
      const { mediaPermissionsToken, recvMediaParams } =
        await this.viewerService.createNewViewer(stream, user);

      response = {
        ...response,
        mediaPermissionsToken,
        recvMediaParams,
        role: 'viewer',
      };

      return response;
    }

    const { token: mediaPermissionsToken, recvMediaParams } =
      await this.media.getViewerParams(user, stream);

    const { role, stream: prevStreamId } = data;

    response = { ...response, mediaPermissionsToken, recvMediaParams, role };

    //TODO: check if host

    //If rejoining
    if (stream === prevStreamId) {
      await this.reactivateUser(user);

      if (role !== 'viewer') {
        const { sendMediaParams, mediaPermissionToken } =
          await this.media.updateMediaRole(data, role);

        response.sendMediaParams = sendMediaParams;
        response.mediaPermissionsToken = mediaPermissionToken;

        response.streamers = [...response.streamers, data];
      }
    }

    return response;
  }

  async setMediaEnabled(
    user: string,
    {
      videoEnabled,
      audioEnabled,
    }: { videoEnabled?: boolean; audioEnabled?: boolean },
  ) {
    const stream = await this.participant.getStreamId(user);

    const update = {};

    if (audioEnabled !== undefined) {
      update['audioEnabled'] = audioEnabled;
    }

    if (videoEnabled !== undefined) {
      const activeVideoStreamers = await this.participant.countVideoStreamers(
        stream,
      );

      //If the user tries to send video when there are already 4 video streamers...
      if (activeVideoStreamers >= 4 && videoEnabled === true) {
        throw new MaxVideoStreamers();
      }

      update['videoEnabled'] = videoEnabled;
    }

    await this.participant.update(user, update);

    this.eventEmitter.emit(EVENT_STREAMER_MEDIA_TOGGLE, {
      user,
      stream,
      videoEnabled,
      audioEnabled,
    });
  }

  async reactivateUser(user: string) {
    const data = await this.participant.get(user);

    if (!data) {
      return;
    }

    await this.participant.setDeactivated(user, data.stream, false);
    this.eventEmitter.emit(EVENT_PARTICIPANT_REJOIN, { participant: data });
  }

  async deactivateUser(user: string) {
    const data = await this.participant.get(user);

    if (!data) {
      return;
    }

    //ignore bots
    if (user.slice(0, 3) === 'bot') {
      return this.removeUserFromStream(user, data.stream);
    }

    await this.participant.setDeactivated(user, data.stream, true);

    this.eventEmitter.emit(EVENT_PARTICIPANT_LEAVE, {
      user,
      stream: data.stream,
    });
  }

  async removeUserFromStream(user: string, stream?: string) {
    const userToRemove = await this.participant.get(user);

    if (userToRemove) {
      await this.media.removeFromNodes(userToRemove);
    }

    const isBot = user.slice(0, 3) === 'bot';

    if (isBot) {
      const instance = await this.botInstanceEntity.getBotInstante(
        user,
        stream,
      );

      await this.deleteUserParticipant(instance.id);
    } else {
      await this.deleteUserParticipant(user);
    }

    this.eventEmitter.emit(EVENT_PARTICIPANT_LEAVE, {
      user,
      stream: userToRemove.stream,
    });
  }

  private async deleteUserParticipant(user: string) {
    try {
      await this.participant.del(user);
    } catch (e) {
      console.error(e);
    }
  }

  async clearStreamData(stream: string) {
    return this.participant.clearStreamData(stream);
  }
}
