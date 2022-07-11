import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnParticipantLeave,
  OnParticipantRejoin,
  OnRoleChange,
  OnStreamEnd,
} from '@warpy-be/interfaces';
import {
  EVENT_PARTICIPANT_LEAVE,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_ROLE_CHANGE,
  EVENT_STREAM_ENDED,
} from '@warpy-be/utils';
import { ParticipantStore } from './participant.store';

@Controller()
export class ParticipantStoreController
  implements OnStreamEnd, OnRoleChange, OnParticipantLeave, OnParticipantRejoin
{
  constructor(private store: ParticipantStore) {}

  @OnEvent(EVENT_ROLE_CHANGE)
  async onRoleChange({ participant }) {
    return this.store.update(participant.id, participant);
  }

  @OnEvent(EVENT_PARTICIPANT_REJOIN)
  async onParticipantRejoin({ participant: { id, stream } }) {
    return this.store.setDeactivated(id, stream, false);
  }

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave({ user, stream }) {
    return this.store.setDeactivated(user, stream, true);
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    return this.store.removeParticipantDataFromStream(stream);
  }
}
