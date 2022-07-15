import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_RAISE_HAND } from '@warpy-be/utils';
import { IParticipantStore } from 'lib/stores';

export interface StreamingPermissionRequester {
  setRaiseHand(user: string, flag: boolean): Promise<void>;
}

export class StreamingPermissionRequesterImpl
  implements StreamingPermissionRequester
{
  constructor(
    private store: IParticipantStore,
    private events: EventEmitter2,
  ) {}

  async setRaiseHand(user: string, flag: boolean) {
    const participant = await this.store.setRaiseHand(user, flag);
    this.events.emit(EVENT_RAISE_HAND, participant);
  }
}
