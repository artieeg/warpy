import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnStreamEnd,
  OnStreamerDowngradeToViewer,
  OnUserConnect,
  OnUserDisconnect,
  OnViewerUpgraded,
} from '@warpy-be/interfaces';
import {
  EVENT_STREAMER_DOWNGRADED_TO_VIEWER,
  EVENT_STREAM_ENDED,
  EVENT_USER_CONNECTED,
  EVENT_USER_DISCONNECTED,
  EVENT_VIEWER_UPGRADED,
} from '@warpy-be/utils';
import { HostService } from './host.service';
import { HostStore } from './host.store';

@Controller()
export class HostController
  implements
    OnUserDisconnect,
    OnUserConnect,
    OnStreamEnd,
    OnStreamerDowngradeToViewer,
    OnViewerUpgraded
{
  constructor(private hostStore: HostStore, private hostService: HostService) {}

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    return this.hostStore.delByStream(stream);
  }

  @OnEvent(EVENT_STREAMER_DOWNGRADED_TO_VIEWER)
  async onStreamerDowngradeToViewer({ participant: { stream, id } }) {
    return this.hostStore.delPossibleHost(stream, id);
  }

  @OnEvent(EVENT_VIEWER_UPGRADED)
  async onViewerUpgraded({ participant: { stream, id } }) {
    return this.hostStore.addPossibleHost(stream, id);
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
