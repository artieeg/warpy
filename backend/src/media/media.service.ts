import { InternalError } from '@backend_2/errors';
import { IFullParticipant } from '@backend_2/participant/participant.entity';
import { Injectable } from '@nestjs/common';
import {
  ICreateTransport,
  IConnectRecvTransportParams,
  ICreateMediaRoom,
  IKickedFromMediaRoom,
  IMediaPermissions,
  INewMediaRoomData,
  INewTransportResponse,
  MediaServiceRole,
} from '@warpy/lib';
import * as jwt from 'jsonwebtoken';
import { NatsService } from '../nats/nats.service';
import { MediaCacheService } from './media.cache';

const secret = process.env.MEDIA_JWT_SECRET || 'test-secret';

@Injectable()
export class MediaService {
  constructor(private cache: MediaCacheService, private nc: NatsService) {}

  createPermissionToken(permissions: IMediaPermissions): string {
    return jwt.sign(permissions, secret, {
      expiresIn: 60,
    });
  }

  async createNewRoom(payload: ICreateMediaRoom): Promise<INewMediaRoomData> {
    const response = await this.nc.request('media.room.create', payload);

    return response as INewMediaRoomData;
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

  async getSendNodeId() {
    return this.cache.getProducerNodeId();
  }

  async getRecvNodeId() {
    return this.cache.getConsumerNodeId();
  }

  async getSendRecvNodeIds() {
    return {
      sendNodeId: await this.getSendNodeId(),
      recvNodeId: await this.getRecvNodeId(),
    };
  }

  private async getNodes(
    permissions?: Partial<IMediaPermissions>,
  ): Promise<{ sendNodeId: string; recvNodeId: string }> {
    if (!permissions) {
      return this.getSendRecvNodeIds();
    }

    return {
      sendNodeId: permissions.sendNodeId || (await this.getSendNodeId()),
      recvNodeId: permissions.recvNodeId || (await this.getRecvNodeId()),
    };
  }

  async getStreamerPermissions(
    user: string,
    room: string,
    optional?: Partial<IMediaPermissions>,
  ) {
    const permissions: IMediaPermissions = {
      user,
      room,
      audio: true,
      video: true,
      ...optional,
      ...(await this.getNodes(optional)),
    };

    const token = this.createPermissionToken(permissions);

    return { token, permissions };
  }

  async getSpeakerPermissions(
    user: string,
    room: string,
    optional?: Partial<IMediaPermissions>,
  ) {
    const permissions: IMediaPermissions = {
      user,
      room,
      audio: true,
      video: false,
      ...optional,
      ...(await this.getNodes(optional)),
    };

    const token = this.createPermissionToken(permissions);

    return { token, permissions };
  }

  async getViewerPermissions(user: string, room: string) {
    const permissions: IMediaPermissions = {
      user,
      room,
      audio: false,
      video: false,
      recvNodeId: await this.cache.getConsumerNodeId(),
    };

    const token = this.createPermissionToken(permissions);

    return { token, permissions };
  }

  async addNewMediaNode(id: string, role: MediaServiceRole) {
    await this.cache.addNewNode(id, role);
  }

  private async kickFromRoom(user: string, stream: string, node: string) {
    const response = await this.nc.request(
      `media.peer.kick-user.${node}`,
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
