import { Injectable, OnModuleInit, Controller, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnUserDisconnect,
  OnNewParticipant,
  OnUserConnect,
} from '@warpy-be/interfaces';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_STREAM_ENDED,
  EVENT_USER_DISCONNECTED,
  EVENT_USER_CONNECTED,
} from '@warpy-be/utils';
import { PreviousStreamStore, PreviousStreamService } from 'lib';
import { NjsMessageService } from './message';
import { NjsStreamStore, StreamModule } from './stream';

@Injectable()
export class NjsPreviousStreamStore
  extends PreviousStreamStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('previousStreamCacheAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Injectable()
export class NjsPreviousStreamService extends PreviousStreamService {
  constructor(
    previousStreamStore: NjsPreviousStreamStore,
    messageService: NjsMessageService,
    streamStore: NjsStreamStore,
  ) {
    super(previousStreamStore, messageService, streamStore);
  }
}

@Controller()
export class PreviousStreamController
  implements OnUserDisconnect, OnNewParticipant, OnUserConnect
{
  constructor(private previousStreamService: NjsPreviousStreamService) {}

  @OnEvent(EVENT_NEW_PARTICIPANT)
  async onNewParticipant({ participant: { id, stream } }) {
    await this.previousStreamService.set(id, stream);
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }: { stream: string }) {
    await this.previousStreamService.clearStream(stream);
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    await this.previousStreamService.expire(user);
  }

  @OnEvent(EVENT_USER_CONNECTED)
  async onUserConnect({ user }) {
    await this.previousStreamService.sendPreviousStream(user);
  }
}

@Module({
  imports: [StreamModule],
  providers: [NjsPreviousStreamStore, NjsPreviousStreamService],
  controllers: [PreviousStreamController],
  exports: [],
})
export class PreviousStreamModule {}
