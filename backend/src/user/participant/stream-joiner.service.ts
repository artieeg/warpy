import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NjsMediaService } from '@warpy-be/media/media.service';
import { StreamJoiner } from 'lib/services';
import { NjsParticipantStore } from '../participant';
import { NjsStreamBanService } from '../participant/ban/ban.service';
import { NjsParticipantService } from '../participant/participant.service';

@Injectable()
export class NjsStreamJoiner extends StreamJoiner {
  constructor(
    participant: NjsParticipantService,
    participantStore: NjsParticipantStore,
    events: EventEmitter2,
    bans: NjsStreamBanService,
    media: NjsMediaService,
  ) {
    super(participant, participantStore, events, bans, media);
  }
}
