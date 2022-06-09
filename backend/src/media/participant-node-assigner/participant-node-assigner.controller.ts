import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnParticipantLeave, OnUserDisconnect } from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_LEAVE,
  EVENT_USER_DISCONNECTED,
} from '@warpy-be/utils';
import { ParticipantNodeAssignerStore } from './participant-node-assigner.store';

@Controller()
export class ParticipantNodeAssignerController
  implements OnParticipantLeave, OnUserDisconnect
{
  constructor(private participantNodeAssigner: ParticipantNodeAssignerStore) {}

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
