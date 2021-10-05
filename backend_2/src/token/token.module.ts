import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RefreshTokenEntity } from './refresh-token.entity';
import { TokenService } from './token.service';

@Module({
  imports: [PrismaModule],
  providers: [TokenService, RefreshTokenEntity],
  controllers: [],
  exports: [TokenService, RefreshTokenEntity],
})
export class TokenModule {}
