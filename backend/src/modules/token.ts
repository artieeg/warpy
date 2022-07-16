import { Injectable, Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TokenService, RefreshTokenStore, RefreshTokenStoreImpl } from 'lib';
import { PrismaModule, PrismaService } from '.';

@Injectable()
export class NJTokenService extends TokenService {
  constructor(configService: ConfigService) {
    super(configService.get('accessJwtSecret'));
  }
}

@Injectable()
export class NjsRefreshTokenStore implements RefreshTokenStore {
  private store: RefreshTokenStore;
  constructor(prisma: PrismaService) {
    this.store = new RefreshTokenStoreImpl(prisma);
  }

  async create(token: string): Promise<void> {
    return this.store.create(token);
  }
}

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [NJTokenService, NjsRefreshTokenStore],
  controllers: [],
  exports: [NJTokenService, NjsRefreshTokenStore],
})
export class TokenModule {}
