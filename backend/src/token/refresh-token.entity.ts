import { Injectable } from '@nestjs/common';
import {
  RefreshTokenStore,
  RefreshTokenStoreImpl,
} from 'lib/stores/refresh-token';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefreshTokenEntity implements RefreshTokenStore {
  private store: RefreshTokenStore;
  constructor(prisma: PrismaService) {
    this.store = new RefreshTokenStoreImpl(prisma);
  }

  async create(token: string): Promise<void> {
    return this.store.create(token);
  }
}
