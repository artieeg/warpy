import { InternalError } from '@warpy-be/errors';
import { IFullParticipant } from '@warpy-be/user/participant';
import { Injectable } from '@nestjs/common';
import {
  ICreateTransport,
  IConnectRecvTransportParams,
  ICreateMediaRoom,
  IKickedFromMediaRoom,
  IMediaPermissions,
  INewMediaRoomData,
  INewTransportResponse,
  Roles,
} from '@warpy/lib';
import * as jwt from 'jsonwebtoken';
import { NatsService } from '../nats/nats.service';
import { MediaBalancerService } from './media-balancer/media-balancer.service';

const secret = process.env.MEDIA_JWT_SECRET || 'test-secret';

@Injectable()
export class MediaService {
  constructor(
    private balancer: MediaBalancerService,
    private nc: NatsService,
  ) {}

  createPermissionToken(permissions: IMediaPermissions): string {
    return jwt.sign(permissions, secret, {
      expiresIn: 60,
    });
  }

  async createNewRoom(payload: ICreateMediaRoom): Promise<INewMediaRoomData> {
    const response = await this.nc.request('media.room.create', payload);

    return response as INewMediaRoomData;
  }

  async updateMediaRole(participant: IFullParticipant, role: Roles) {
    const { stream, id, recvNodeId, sendNodeId: prevSendNodeId } = participant;

    let sendMedia: INewTransportResponse;
    let sendNodeId = prevSendNodeId;

    //If participant becomes audio/video streamer, assign them a send node
    if (role !== 'viewer') {
      sendNodeId = await this.balancer.getSendNodeId(stream);

      sendMedia = await this.createSendTransport({
        roomId: stream,
        speaker: id,
      });
    }

    const token = this.createPermissionToken({
      audio: role !== 'viewer',
      video: role === 'streamer',
      sendNodeId: role === 'viewer' ? null : sendNodeId,
      recvNodeId,
      user: id,
      room: stream,
    });

    return {
      mediaPermissionToken: token,
      sendMediaParams: sendMedia,
      sendNodeId,
    };
  }

  async createSendTransport(
    params: ICreateTransport,
  ): Promise<INewTransportResponse> {
    const response = await this.nc.request(
      `media.transport.send-transport`,
      params,
      {
        timeout: 60000,
      },
    );

    return response as INewTransportResponse;
  }

  private async getRecvParams(
    recvNodeId: string,
    user: string,
    roomId: string,
  ) {
    const recvMediaParams: IConnectRecvTransportParams = await this.nc.request(
      `media.peer.join.${recvNodeId}`,
      {
        user,
        roomId,
      },
      {
        timeout: 60000,
      },
    );

    return recvMediaParams;
  }

  async getBotParams(recvNodeId: string, user: string, roomId: string) {
    return this.getRecvParams(recvNodeId, user, roomId);
  }

  async getViewerParams(user: string, roomId: string) {
    const { token, recvNodeId } = await this.getViewerToken(user, roomId);
    const recvMediaParams = await this.getRecvParams(recvNodeId, user, roomId);

    return {
      token,
      recvNodeId,
      recvMediaParams,
    };
  }

  async getStreamerParams({
    user,
    roomId,
    audio,
    video,
  }: {
    user: string;
    roomId: string;
    audio: boolean;
    video: boolean;
  }) {
    const { token, recvNodeId, sendNodeId } = await this.getStreamerToken(
      user,
      roomId,
      audio,
      video,
    );

    const sendMediaParams = await this.createSendTransport({
      roomId,
      speaker: user,
    });

    const recvMediaParams = await this.getRecvParams(recvNodeId, user, roomId);

    return {
      token,
      recvNodeId,
      sendNodeId,
      recvMediaParams,
      sendMediaParams,
    };
  }

  async getStreamerToken(
    user: string,
    stream: string,
    audio: boolean,
    video: boolean,
  ) {
    const [sendNodeId, recvNodeId] = await Promise.all([
      this.balancer.getSendNodeId(stream),
      this.balancer.getRecvNodeId(stream),
    ]);

    const token = this.createPermissionToken({
      user,
      room: stream,
      audio,
      video,
      sendNodeId,
      recvNodeId,
    });

    return { token, sendNodeId, recvNodeId };
  }

  async getBotToken(bot: string, room: string) {
    const [sendNodeId, recvNodeId] = await Promise.all([
      this.balancer.getSendNodeId(room),
      this.balancer.getRecvNodeId(room),
    ]);

    const token = this.createPermissionToken({
      user: bot,
      room,
      audio: true,
      video: true,
      sendNodeId,
      recvNodeId,
    });

    return { token, sendNodeId, recvNodeId };
  }

  async getViewerToken(user: string, room: string) {
    const recvNodeId = await this.balancer.getRecvNodeId(room);

    const permissions: IMediaPermissions = {
      user,
      room,
      audio: false,
      video: false,
      recvNodeId,
    };

    const token = this.createPermissionToken(permissions);

    return { token, recvNodeId };
  }

  private async kickFromRoom(user: string, stream: string, node: string) {
    const response = await this.nc.request(
      `media.peer.user-leave.${node}`,
      {
        user,
        stream,
      },
      { timeout: 5000 },
    );

    return response as IKickedFromMediaRoom;
  }

  async removeFromNodes({
    id,
    stream,
    sendNodeId,
    recvNodeId,
  }: IFullParticipant) {
    const [sendNodeResponse, recvNodeResponse] = await Promise.all([
      sendNodeId ? this.kickFromRoom(id, stream, sendNodeId) : null,
      recvNodeId ? this.kickFromRoom(id, stream, recvNodeId) : null,
    ]);

    if (
      (sendNodeResponse && sendNodeResponse.status !== 'ok') ||
      (recvNodeResponse && recvNodeResponse.status !== 'ok')
    ) {
      throw new InternalError();
    }
  }

  async removeUserProducers(
    user: string,
    sendNode: string,
    stream: string,
    producers: { video?: boolean; audio?: boolean },
  ) {
    this.nc.publish(
      `media.peer.remove-producers.${sendNode}`,
      this.nc.jc.encode({ user, stream, producers }),
    );
  }
}
