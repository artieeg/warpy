import { InternalError } from '@backend_2/errors';
import { IFullParticipant } from '@backend_2/user/participant/common/participant.entity';
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

    //If the user was viewer, assign them to a media send node
    if (participant.role === 'viewer') {
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

    return { mediaPermissionToken: token, media: sendMedia, sendNodeId };
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

  async getViewerParams(recvNodeId: string, user: string, roomId: string) {
    const response = await this.nc.request(
      `media.peer.join.${recvNodeId}`,
      {
        user,
        roomId,
      },
      {
        timeout: 60000,
      },
    );

    return response as IConnectRecvTransportParams;
  }

  async getSendRecvNodeIds(stream: string) {
    return {
      sendNodeId: await this.balancer.getSendNodeId(stream),
      recvNodeId: await this.balancer.getRecvNodeId(stream),
    };
  }

  async getStreamerToken(user: string, stream: string) {
    const [sendNodeId, recvNodeId] = await Promise.all([
      this.balancer.getSendNodeId(stream),
      this.balancer.getRecvNodeId(stream),
    ]);

    const token = this.createPermissionToken({
      user,
      room: stream,
      audio: true,
      video: true,
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

  async removeUserFromNodes({
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
