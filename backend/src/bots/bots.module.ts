import { DeveloperAccountModule } from '@backend_2/developer_account/developer_account.module';
import { Module } from '@nestjs/common';
import { BotsController } from './bots.controller';
import { BotsEntity } from './bots.entity';
import { BotsService } from './bots.service';

@Module({
  imports: [DeveloperAccountModule],
  providers: [BotsService, BotsEntity],
  controllers: [BotsController],
  exports: [],
})
export class BotsModule {}
