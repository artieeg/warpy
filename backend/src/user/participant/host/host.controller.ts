import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnRoleChange,
  OnStreamEnd,
  OnUserConnect,
  OnUserDisconnect,
} from '@warpy-be/interfaces';
import {
  EVENT_ROLE_CHANGE,
  EVENT_STREAM_ENDED,
  EVENT_USER_CONNECTED,
  EVENT_USER_DISCONNECTED,
} from '@warpy-be/utils';
import { HostService } from './host.service';
import { HostStore } from './host.store';

@Controller()
export class HostController
  implements OnUserDisconnect, OnUserConnect, OnStreamEnd, OnRoleChange
{
  constructor(private hostStore: HostStore, private hostService: HostService) {}

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    return this.hostStore.delByStream(stream);
  }

  @OnEvent(EVENT_ROLE_CHANGE)
  async onRoleChange({ participant }) {
    this.hostService.handlePossibleHost(participant);
  }

  //TODO: handle stream rejoins instead
  @OnEvent(EVENT_USER_CONNECTED)
  async onUserConnect({ user }) {
    return this.hostStore.setStreamHostOnlineStatus(user, true);
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    return this.hostService.tryReassignHostAfterTime(user);
  }
}
