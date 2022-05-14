import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '@warpy-be/user/user.module';
import { ParticipantStore } from '../store';
import { StreamerController } from './streamer.controller';
import { StreamerService } from './streamer.service';

@Module({
  imports: [ParticipantStore, forwardRef(() => UserModule)],
  providers: [StreamerService],
  controllers: [StreamerController],
  exports: [],
})
export class StreamerModule {}
