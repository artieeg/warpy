import { MediaModule } from '@backend_2/media/media.module';
import { Module } from '@nestjs/common';
import { ParticipantBanModule } from '../ban/ban.module';
import { ViewerController } from './viewer.controller';
import { ViewerService } from './viewer.service';

@Module({
  imports: [MediaModule, ParticipantBanModule],
  providers: [ViewerService],
  controllers: [ViewerController],
  exports: [ViewerService],
})
export class ViewerModule {}
