import { EVENT_STREAM_JOINED, EVENT_USER_DISCONNECTED } from '@backend_2/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PreviousStreamService } from './previous-stream.service';

@Controller()
export class PreviousStreamController {
  constructor(private previousStreamService: PreviousStreamService) {}

  @OnEvent(EVENT_STREAM_JOINED)
  async onStreamJoin({ user, stream }: { user: string; stream: string }) {
    await this.previousStreamService.set(user, stream);
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }: { user: string }) {
    await this.previousStreamService.expire(user);
  }
}
