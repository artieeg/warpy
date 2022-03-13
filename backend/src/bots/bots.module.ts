import { MediaModule } from '@warpy-be/media/media.module';
import { PrismaModule } from '@warpy-be/prisma/prisma.module';
import { TokenModule } from '@warpy-be/token/token.module';
import { forwardRef, Module } from '@nestjs/common';
import { BotInstanceController } from './bot-instance.controller';
import { BotInstanceEntity } from './bot-instance.entity';
import { BotInstanceService } from './bot-instance.service';
import { BotsController } from './bots.controller';
import { BotsEntity } from './bots.entity';
import { BotsService } from './bots.service';
import { UserModule } from '@warpy-be/user/user.module';
import { DeveloperAccountModule } from '@warpy-be/user/developer_account/developer_account.module';

@Module({
  imports: [
    PrismaModule,
    MediaModule,
    forwardRef(() => UserModule),
    DeveloperAccountModule,
    TokenModule,
  ],
  providers: [BotsService, BotInstanceService, BotInstanceEntity, BotsEntity],
  controllers: [BotInstanceController, BotsController],
  exports: [BotsEntity, BotInstanceEntity],
})
export class BotsModule {}
