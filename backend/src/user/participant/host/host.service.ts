import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NjsTimerService } from '@warpy-be/shared';
import { UserStoreService } from '@warpy-be/user/user.store';
import { HostService } from 'lib/services/stream-host';
import { NjsParticipantStore } from '../store';
import { NjsHostStore } from './host.store';

@Injectable()
export class NjsHostService extends HostService {
  constructor(
    timerService: NjsTimerService,
    hostStore: NjsHostStore,
    eventEmitter: EventEmitter2,
    user: UserStoreService,
    participantStore: NjsParticipantStore,
  ) {
    super(timerService, hostStore, eventEmitter, user, participantStore);
  }
}
