import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnParticipantRejoin,
  OnStreamEnd,
  OnStreamerDowngradeToViewer,
  OnUserDisconnect,
  OnViewerUpgraded,
} from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_REJOIN,
  EVENT_STREAMER_DOWNGRADED_TO_VIEWER,
  EVENT_STREAM_ENDED,
  EVENT_USER_DISCONNECTED,
  EVENT_VIEWER_UPGRADED,
} from '@warpy-be/utils';
import { HostService } from './host.service';
import { HostStore } from './host.store';

@Controller()
export class HostController
  implements
    OnUserDisconnect,
    OnParticipantRejoin,
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
  async onStreamerDowngradeToViewer({ participant }) {
    return this.hostStore.delPossibleHost(participant);
  }

  @OnEvent(EVENT_VIEWER_UPGRADED)
  async onViewerUpgraded({ participant }) {
    return this.hostStore.addPossibleHost(participant);
  }

  @OnEvent(EVENT_PARTICIPANT_REJOIN)
  async onParticipantRejoin({ participant }) {
    return this.hostService.handleRejoinedUser(participant.id);
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    return this.hostService.tryReassignHostAfterTime(user);
  }
}
