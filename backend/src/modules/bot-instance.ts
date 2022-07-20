import { Injectable, Module } from '@nestjs/common';
import { BotInstanceService, BotInstanceStore } from 'lib';
import { PrismaModule, PrismaService } from './prisma';
import { NJTokenService, TokenModule } from './token';

@Injectable()
export class NjsBotInstanceStore extends BotInstanceStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsBotInstanceService extends BotInstanceService {
  constructor(botInstanceStore: NjsBotInstanceStore, token: NJTokenService) {
    super(token, botInstanceStore);
  }
}

@Module({
  imports: [PrismaModule, TokenModule],
  providers: [NjsBotInstanceService, NjsBotInstanceStore],
  controllers: [],
  exports: [NjsBotInstanceService, NjsBotInstanceStore],
})
export class BotInstanceModule {}
