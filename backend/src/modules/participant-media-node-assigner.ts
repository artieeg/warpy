import { Injectable, OnModuleInit, Controller, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { OnParticipantLeave, OnUserDisconnect } from '@warpy-be/interfaces';
import {
  EVENT_USER_DISCONNECTED,
  EVENT_PARTICIPANT_LEAVE,
} from '@warpy-be/utils';
import { ParticipantNodeAssignerStore } from '@warpy-be/app';

@Injectable()
export class NjsParticipantNodeAssignerStore
  extends ParticipantNodeAssignerStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('participantNodeAssignerAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Controller()
export class ParticipantNodeAssignerController
  implements OnParticipantLeave, OnUserDisconnect
{
  constructor(
    private participantNodeAssigner: NjsParticipantNodeAssignerStore,
  ) {}

  private async clearAssignedNodes(user: string) {
    await this.participantNodeAssigner.del(user);
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    await this.clearAssignedNodes(user);
  }

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user }) {
    await this.clearAssignedNodes(user);
  }
}

@Module({
  imports: [],
  providers: [NjsParticipantNodeAssignerStore],
  controllers: [],
  exports: [NjsParticipantNodeAssignerStore],
})
export class ParticipantNodeAssignerModule {}
