import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnStreamEnd, OnUserDisconnect } from '@warpy-be/interfaces';
import { EVENT_STREAM_ENDED, EVENT_USER_DISCONNECTED } from '@warpy-be/utils';
import { HostStore } from './host.store';

@Controller()
export class HostController implements OnUserDisconnect, OnStreamEnd {
  constructor(private hostStore: HostStore) {}

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    return this.hostStore.delByStream(stream);
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    //this.hostStore.delByHost(user);
  }
}
