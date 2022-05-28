import { Module } from '@nestjs/common';
import { MediaModule } from '@warpy-be/media/media.module';
import { ParticipantBanModule } from '../ban/ban.module';
import { StreamerService } from './streamer.service';

@Module({
  imports: [MediaModule, ParticipantBanModule],
  providers: [StreamerService],
  controllers: [],
  exports: [StreamerService],
})
export class StreamerModule {}
