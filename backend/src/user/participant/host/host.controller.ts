import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  OnNewParticipant,
  OnParticipantLeave,
  OnParticipantRejoin,
  OnStreamEnd,
  OnStreamerDowngradeToViewer,
  OnViewerUpgraded,
} from '@warpy-be/interfaces';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_LEAVE,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_STREAMER_DOWNGRADED_TO_VIEWER,
  EVENT_STREAM_ENDED,
  EVENT_VIEWER_UPGRADED,
} from '@warpy-be/utils';
import { IHostReassignRequest } from '@warpy/lib';
import { HostService } from './host.service';
import { HostStore } from './host.store';

@Controller()
//OnUserDisconnect,
export class HostController
  implements
    OnParticipantRejoin,
    OnStreamEnd,
    OnNewParticipant,
    OnStreamerDowngradeToViewer,
    OnViewerUpgraded,
    OnParticipantLeave
{
  constructor(private hostStore: HostStore, private hostService: HostService) {}

  @MessagePattern('host.reassign')
  async onHostReassign({ host, user }: IHostReassignRequest) {
    return this.hostService.reassignHost(user, host);
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    return this.hostStore.delByStream(stream);
  }

  @OnEvent(EVENT_NEW_PARTICIPANT)
  async onNewParticipant({ participant }) {
    if (participant.role === 'streamer') {
      return this.hostStore.setStreamHost(participant);
    }
  }

  @OnEvent(EVENT_STREAMER_DOWNGRADED_TO_VIEWER)
  async onStreamerDowngradeToViewer({ participant }) {
    return this.hostStore.delPossibleHost(participant.id, participant.stream);
  }

  @OnEvent(EVENT_VIEWER_UPGRADED)
  async onViewerUpgraded({ participant }) {
    return this.hostStore.addPossibleHost(participant);
  }

  @OnEvent(EVENT_PARTICIPANT_REJOIN)
  async onParticipantRejoin({ participant }) {
    return this.hostService.handleRejoinedUser(participant.id);
  }

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user, stream }) {
    const isHost = await this.hostStore.isHost(user);

    if (!isHost) {
      return this.hostStore.delPossibleHost(user, stream);
    } else {
      return this.hostService.tryReassignHostAfterTime(user);
    }
  }
}
