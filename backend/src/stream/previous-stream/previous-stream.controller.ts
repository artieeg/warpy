import { OnUserDisconnect } from '@backend_2/interfaces';
import { IFullParticipant } from '@backend_2/user/participant';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_STREAM_ENDED,
  EVENT_USER_CONNECTED,
  EVENT_USER_DISCONNECTED,
} from '@backend_2/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PreviousStreamService } from './previous-stream.service';

@Controller()
export class PreviousStreamController implements OnUserDisconnect {
  constructor(private previousStreamService: PreviousStreamService) {}

  @OnEvent(EVENT_NEW_PARTICIPANT)
  async onStreamJoin({ id, stream }: IFullParticipant) {
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
  async onUserConnect({ user }: { user: string }) {
    await this.previousStreamService.sendPreviousStream(user);
  }
}
