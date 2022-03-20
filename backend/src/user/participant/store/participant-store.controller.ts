import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnStreamEnd } from '@warpy-be/interfaces';
import { EVENT_STREAM_ENDED } from '@warpy-be/utils';
import { ParticipantStore } from './participant.store';

@Controller()
export class ParticipantStoreController implements OnStreamEnd {
  constructor(private store: ParticipantStore) {}

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    console.log('clearing stream', { stream });

    return this.store.clearStreamData(stream);
  }
}
