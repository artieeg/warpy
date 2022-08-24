import { Injectable, Controller, Module, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnParticipantLeave, OnParticipantKicked } from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_KICKED,
  EVENT_PARTICIPANT_LEAVE,
} from '@warpy-be/utils';
import { MediaService } from '@warpy-be/app';
import { MediaBalancerModule, NjsMediaBalancerService } from './media-balancer';
import { NatsModule, NjsNatsService } from './nats';
import {
  NjsParticipantNodeAssignerStore,
  ParticipantNodeAssignerModule,
} from './participant-media-node-assigner';

@Injectable()
export class NjsMediaService extends MediaService {
  constructor(
    nodeAssigner: NjsParticipantNodeAssignerStore,
    balancer: NjsMediaBalancerService,
    nc: NjsNatsService,
  ) {
    super(nodeAssigner, balancer, nc);
  }
}

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
