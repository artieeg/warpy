import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { RefreshTokenEntity } from './refresh-token.entity';
import { NJTokenService } from './token.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  providers: [NJTokenService, RefreshTokenEntity],
  controllers: [],
  exports: [NJTokenService, RefreshTokenEntity],
})
export class TokenModule {}
