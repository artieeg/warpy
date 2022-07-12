import { NjsBotInstanceStore } from '@warpy-be/bots/bot-instance.entity';
import { MaxVideoStreamers } from '@warpy-be/errors';
import { EVENT_STREAMER_MEDIA_TOGGLE } from '@warpy-be/utils';
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
  constructor(
    private participantStore: NjsParticipantStore,
    hostService: NjsHostService,
    botInstanceStore: NjsBotInstanceStore,
    private events: EventEmitter2,
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

  async setMediaEnabled(
    user: string,
    {
      videoEnabled,
      audioEnabled,
    }: { videoEnabled?: boolean; audioEnabled?: boolean },
  ) {
    const stream = await this.participantStore.getStreamId(user);

    const update = {};

    if (audioEnabled !== undefined) {
      update['audioEnabled'] = audioEnabled;
    }

    if (videoEnabled !== undefined) {
      const activeVideoStreamers =
        await this.participantStore.countVideoStreamers(stream);

      //If the user tries to send video when there are already 4 video streamers...
      if (activeVideoStreamers >= 4 && videoEnabled === true) {
        throw new MaxVideoStreamers();
      }

      update['videoEnabled'] = videoEnabled;
    }

    await this.participantStore.update(user, update);

    this.events.emit(EVENT_STREAMER_MEDIA_TOGGLE, {
      user,
      stream,
      videoEnabled,
      audioEnabled,
    });
  }
}
