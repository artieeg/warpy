import { Injectable, Controller, forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  OnParticipantRejoin,
  OnNewStream,
  OnStreamEnd,
  OnStreamerDowngradeToViewer,
  OnViewerUpgraded,
  OnParticipantLeave,
} from '@warpy-be/interfaces';
import {
  EVENT_STREAM_ENDED,
  EVENT_STREAM_CREATED,
  EVENT_STREAMER_DOWNGRADED_TO_VIEWER,
  EVENT_VIEWER_UPGRADED,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_PARTICIPANT_LEAVE,
} from '@warpy-be/utils';
import { HostStore } from 'lib';
import { HostService } from 'lib/services/stream-host';
import { IHostReassignRequest } from '@warpy/lib';
import { UserModule } from '.';

@Injectable()
export class NjsHostStore extends HostStore {
  constructor(configService: ConfigService) {
    super(configService.get('streamHostAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Injectable()
export class NjsHostService extends HostService {}

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

@Module({
  imports: [UserModule],
  providers: [NjsHostStore, NjsHostService],
  controllers: [HostController],
  exports: [NjsHostService],
})
export class HostModule {}
