import { EventEmitter2 } from '@nestjs/event-emitter';
import { MaxVideoStreamers } from '@warpy-be/errors';
import { EVENT_STREAMER_MEDIA_TOGGLE } from '@warpy-be/utils';
import { IParticipantStore } from 'lib';
import { IParticipant } from '@warpy/lib';

export interface MediaToggler {
  setMediaEnabled(
    user: string,
    {
      videoEnabled,
      audioEnabled,
    }: { videoEnabled?: boolean; audioEnabled?: boolean },
  ): Promise<void>;
}

export class MediaTogglerImpl implements MediaToggler {
  constructor(
    private participantStore: IParticipantStore,
    private events: EventEmitter2,
  ) {}

  async setMediaEnabled(
    user: string,
    {
      videoEnabled,
      audioEnabled,
    }: { videoEnabled?: boolean; audioEnabled?: boolean },
  ) {
    const stream = await this.participantStore.getStreamId(user);

    const update: Partial<IParticipant> = {};

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
