import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NjsParticipantStore } from '../store';
import { NjsStreamBanStore } from './ban.entity';
import { StreamBanService } from 'lib/services';

@Injectable()
export class NjsStreamBanService extends StreamBanService {
  constructor(
    banEntity: NjsStreamBanStore,
    participant: NjsParticipantStore,
    eventEmitter: EventEmitter2,
  ) {
    super(banEntity, participant, eventEmitter);
  }
}
