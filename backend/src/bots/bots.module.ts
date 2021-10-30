import { Module } from '@nestjs/common';
import { BotsController } from './bots.controller';
import { BotsService } from './bots.service';

@Module({
  imports: [],
  providers: [BotsService],
  controllers: [BotsController],
  exports: [],
})
export class BotsModule {}
