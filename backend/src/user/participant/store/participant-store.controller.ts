import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnRoleChange, OnStreamEnd } from '@warpy-be/interfaces';
import { EVENT_ROLE_CHANGE, EVENT_STREAM_ENDED } from '@warpy-be/utils';
import { ParticipantStore } from './participant.store';

@Controller()
export class ParticipantStoreController implements OnStreamEnd, OnRoleChange {
  constructor(private store: ParticipantStore) {}

  @OnEvent(EVENT_ROLE_CHANGE)
  async onRoleChange({ participant }) {
    return this.store.update(participant.id, participant);
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    return this.store.clearStreamData(stream);
  }
}
