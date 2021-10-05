import { InternalError } from '@backend_2/errors';
import { IFullParticipant } from '@backend_2/participant/participant.entity';
import { Injectable } from '@nestjs/common';
import {
  IConnectNewSpeakerMedia,
  IConnectRecvTransportParams,
  ICreateMediaRoom,
  IKickedFromMediaRoom,
  IMediaPermissions,
  INewMediaNode,
  INewMediaRoomData,
  INewSpeakerMediaResponse,
  MediaServiceRole,
} from '@warpy/lib';
import * as jwt from 'jsonwebtoken';
import { NatsService } from '../nats/nats.service';
import { MediaCacheService } from './media.cache';

const secret = process.env.MEDIA_JWT_SECRET || 'test-secret';

@Injectable()
export class MediaService {
  constructor(private cache: MediaCacheService, private nc: NatsService) {}

  private createPermissionToken(permissions: IMediaPermissions): string {
    return jwt.sign(permissions, secret, {
      expiresIn: 60,
    });
  }

  async createNewRoom(payload: ICreateMediaRoom): Promise<INewMediaRoomData> {
    const response = await this.nc.request('media.room.create', payload);

    return response as INewMediaRoomData;
  }

  async getSpeakerParams(
    params: IConnectNewSpeakerMedia,
  ): Promise<INewSpeakerMediaResponse> {
    const response = await this.nc.request(`media.peer.make-speaker`, params, {
      timeout: 60000,
    });

    return response as INewSpeakerMediaResponse;
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
      recvNodeId: optional.recvNodeId || (await this.getRecvNodeId()),
      sendNodeId: optional.sendNodeId || (await this.getSendNodeId()),
      ...optional,
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
      recvNodeId: optional.recvNodeId || (await this.getRecvNodeId()),
      sendNodeId: optional.sendNodeId || (await this.getSendNodeId()),
      ...optional,
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
      sendNodeResponse?.status !== 'ok' &&
      recvNodeResponse?.status !== 'ok'
    ) {
      throw new InternalError();
    }
  }
}
