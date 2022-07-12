import { MediaModule } from '@warpy-be/media/media.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { TokenModule } from '@warpy-be/token/token.module';
import { Module } from '@nestjs/common';
import { BotInstanceController } from './bot-instance.controller';
import { NjsBotInstanceStore } from './bot-instance.entity';
import { BotInstanceService } from './bot-instance.service';
import { BotsController } from './bots.controller';
import { BotsEntity } from './bots.entity';
import { BotsService } from './bots.service';
import { DeveloperAccountModule } from '@warpy-be/user/developer_account/developer_account.module';

@Module({
  imports: [PrismaModule, MediaModule, DeveloperAccountModule, TokenModule],
  providers: [BotsService, BotInstanceService, NjsBotInstanceStore, BotsEntity],
  controllers: [BotInstanceController, BotsController],
  exports: [BotsEntity, NjsBotInstanceStore],
})
export class BotsModule {}
