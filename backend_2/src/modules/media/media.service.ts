import { Injectable } from '@nestjs/common';
import { IConnectRecvTransportParams, IMediaPermissions } from '@warpy/lib';
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

  async getConsumerParams(recvNodeId: string, user: string, roomId: string) {
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

  async createNewViewer(user: string, room: string) {
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
}
