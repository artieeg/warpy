import { Module } from '@nestjs/common';
import { BotService } from './bots.service';
import { BotsController } from './bots.controller';

@Module({
  imports: [BotService],
  controllers: [BotsController],
  providers: [BotService],
})
export class BotsModule {}
