import { Injectable, Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RefreshTokenStore, TokenService } from '@warpy-be/app';
import { PrismaModule, PrismaService } from './prisma';

@Injectable()
export class NJTokenService extends TokenService {
  constructor(configService: ConfigService) {
    super(configService.get('accessJwtSecret'));
  }
}

@Injectable()
export class NjsRefreshTokenStore extends RefreshTokenStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [NJTokenService, NjsRefreshTokenStore],
  controllers: [],
  exports: [NJTokenService, NjsRefreshTokenStore],
})
export class TokenModule {}
