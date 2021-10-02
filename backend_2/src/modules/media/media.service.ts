import { Injectable } from '@nestjs/common';
import { IMediaPermissions } from '@warpy/lib';
import jwt from 'jsonwebtoken';
import { MediaCacheService } from './media.cache';

const secret = process.env.MEDIA_JWT_SECRET || 'test-secret';

@Injectable()
export class MediaService {
  constructor(private cache: MediaCacheService) {}

  private createPermissionToken(permissions: IMediaPermissions): string {
    return jwt.sign(permissions, secret, {
      expiresIn: 60,
    });
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
