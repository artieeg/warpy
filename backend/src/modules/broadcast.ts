import {
  Controller,
  Global,
  Injectable,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EVENT_REACTIONS,
  EVENT_ACTIVE_SPEAKERS,
  EVENT_ROLE_CHANGE,
  EVENT_RAISE_HAND,
} from '@warpy-be/utils';
import {
  BroadcastUserListStore,
  BroadcastService,
  ActiveSpeakersEvent,
  ReactionsEvent,
} from '@warpy-be/app';
import { Participant } from '@warpy/lib';
import { NjsMessageService } from './message';

@Injectable()
export class NjsBroadcastUserListStore
  extends BroadcastUserListStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('broadcastUserListStoreAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Injectable()
export class NjsBroadcastService extends BroadcastService {
  constructor(
    messageService: NjsMessageService,
    broadcastUserListStore: NjsBroadcastUserListStore,
  ) {
    super(messageService, broadcastUserListStore);
  }
}

@Controller()
export class BroadcastController {
  constructor(private broadcast: NjsBroadcastService) {}

  @OnEvent(EVENT_RAISE_HAND)
  async onRaiseHand(data: Participant) {
    console.log(data);
    return this.broadcast.broadcastHandRaise(data);
  }
}

@Module({
  imports: [],
  controllers: [BroadcastController],
  providers: [NjsBroadcastService, NjsBroadcastUserListStore],
  exports: [NjsBroadcastService],
})
@Global()
export class BroadcastModule {}
