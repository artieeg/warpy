import { OnNewParticipant, OnUserDisconnect } from '@warpy-be/interfaces';
import { IFullParticipant } from '@warpy-be/user/participant';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_STREAM_ENDED,
  EVENT_USER_CONNECTED,
  EVENT_USER_DISCONNECTED,
} from '@warpy-be/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PreviousStreamService } from './previous-stream.service';

@Controller()
export class PreviousStreamController
  implements OnUserDisconnect, OnNewParticipant
{
  constructor(private previousStreamService: PreviousStreamService) {}

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
  async onUserConnect({ user }: { user: string }) {
    await this.previousStreamService.sendPreviousStream(user);
  }
}
