import { MediaModule } from '@warpy-be/media/media.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { TokenModule } from '@warpy-be/token/token.module';
import { Module } from '@nestjs/common';
import { BotInstanceController } from './bot-instance.controller';
import { NjsBotInstanceStore } from './bot-instance.entity';
import { NjsBotInstanceService } from './bot-instance.service';
import { BotsController } from './bots.controller';
import { NjsBotStore } from './bots.entity';
import { NjsBotsService } from './bots.service';
import { DeveloperAccountModule } from '@warpy-be/user/developer_account/developer_account.module';

@Module({
  imports: [PrismaModule, MediaModule, DeveloperAccountModule, TokenModule],
  providers: [
    NjsBotsService,
    NjsBotInstanceService,
    NjsBotInstanceStore,
    NjsBotStore,
  ],
  controllers: [BotInstanceController, BotsController],
  exports: [NjsBotStore, NjsBotInstanceStore],
})
export class BotsModule {}
