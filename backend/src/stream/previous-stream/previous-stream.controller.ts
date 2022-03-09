import { OnUserDisconnectEventHandler } from '@backend_2/interfaces';
import {
  EVENT_STREAM_ENDED,
  EVENT_STREAM_JOINED,
  EVENT_USER_CONNECTED,
  EVENT_USER_DISCONNECTED,
} from '@backend_2/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PreviousStreamService } from './previous-stream.service';

@Controller()
export class PreviousStreamController implements OnUserDisconnectEventHandler {
  constructor(private previousStreamService: PreviousStreamService) {}

  @OnEvent(EVENT_STREAM_JOINED)
  async onStreamJoin({ user, stream }: { user: string; stream: string }) {
    await this.previousStreamService.set(user, stream);
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }: { stream: string }) {
    //TODO
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    await this.previousStreamService.expire(user);
  }

  @OnEvent(EVENT_USER_CONNECTED)
  async onUserConnect({ user }: { user: string }) {
    await this.previousStreamService.sendPreviousStream(user);
  }
}
