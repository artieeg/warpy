import { Injectable, Controller, Module, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnParticipantLeave, OnParticipantKicked } from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_KICKED,
  EVENT_PARTICIPANT_LEAVE,
} from '@warpy-be/utils';
import { MediaService } from 'lib';
import { NatsModule, ParticipantNodeAssignerModule } from '.';
import { MediaBalancerModule } from './media-balancer';

@Injectable()
export class NjsMediaService extends MediaService {}

@Controller()
export class MediaController
  implements OnParticipantLeave, OnParticipantKicked
{
  constructor(private mediaService: NjsMediaService) {}

  @OnEvent(EVENT_PARTICIPANT_KICKED)
  async onParticipantKicked({ id, stream }) {
    try {
      await this.mediaService.removeFromNodes({
        id,
        stream,
      });
    } catch (e) {}
  }

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user, stream }) {
    if (!stream) {
      return;
    }

    try {
      await this.mediaService.removeFromNodes({
        id: user,
        stream,
      });
    } catch (e) {}
  }
}

@Module({
  imports: [
    forwardRef(() => NatsModule),
    MediaBalancerModule,
    ParticipantNodeAssignerModule,
  ],
  providers: [NjsMediaService],
  exports: [NjsMediaService],
  controllers: [MediaController],
})
export class MediaModule {}
