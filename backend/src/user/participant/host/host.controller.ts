import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  OnNewStream,
  OnParticipantLeave,
  OnParticipantRejoin,
  OnStreamEnd,
  OnStreamerDowngradeToViewer,
  OnViewerUpgraded,
} from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_LEAVE,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_STREAMER_DOWNGRADED_TO_VIEWER,
  EVENT_STREAM_CREATED,
  EVENT_STREAM_ENDED,
  EVENT_VIEWER_UPGRADED,
} from '@warpy-be/utils';
import { IHostReassignRequest } from '@warpy/lib';
import { NjsHostService } from './host.service';
import { NjsHostStore } from './host.store';

@Controller()
export class HostController
  implements
    OnParticipantRejoin,
    OnNewStream,
    OnStreamEnd,
    OnStreamerDowngradeToViewer,
    OnViewerUpgraded,
    OnParticipantLeave
{
  constructor(
    private hostStore: NjsHostStore,
    private hostService: NjsHostService,
  ) {}

  @MessagePattern('host.reassign')
  async onHostReassign({ host, user }: IHostReassignRequest) {
    await this.hostService.reassignHost(user, host);

    return {
      host,
    };
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    return this.hostStore.delByStream(stream);
  }

  @OnEvent(EVENT_STREAM_CREATED)
  async onNewStream({ stream }) {
    const { owner, id } = stream;

    await this.hostService.initStreamHost({
      user: owner,
      stream: id,
    });
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
