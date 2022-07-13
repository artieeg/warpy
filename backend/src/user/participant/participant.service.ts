import { NjsBotInstanceStore } from '@warpy-be/bots/bot-instance.entity';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NjsParticipantStore } from './store';
import { NjsHostService } from './host/host.service';
import { ParticipantService } from 'lib/services/participant';
import { NjsMediaService } from '@warpy-be/media/media.service';
import { NjsUserService } from '../user.service';
import { NjsStreamBanService } from './ban/ban.service';

@Injectable()
export class NjsParticipantService extends ParticipantService {
  /*
  constructor(
    participantStore: NjsParticipantStore,
    hostService: NjsHostService,
    botInstanceStore: NjsBotInstanceStore,
    events: EventEmitter2,
    user: NjsUserService,
    bans: NjsStreamBanService,
    media: NjsMediaService,
  ) {
    super(
      participantStore,
      hostService,
      botInstanceStore,
      events,
      user,
      bans,
      media,
    );
  }
  */
}
