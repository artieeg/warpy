import { EventEmitter2 } from '@nestjs/event-emitter';
import { BotInstanceStore, ParticipantStore } from '@warpy-be/app';
import { UserService } from '../user';
import { Participant } from '@warpy/lib';
import {
  MaxVideoStreamers,
  ParticipantAlreadyLeft,
  UserNotFound,
} from '@warpy-be/errors';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_LEAVE,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_RAISE_HAND,
  EVENT_STREAMER_MEDIA_TOGGLE,
} from '@warpy-be/utils';

export class ParticipantService {
  constructor(
    private participantStore: ParticipantStore,
    private botInstanceStore: BotInstanceStore,
    private events: EventEmitter2,
    private user: UserService,
  ) {}

  async get(id: string) {
    const data = await this.participantStore.get(id);

    if (!data) {
      throw new UserNotFound();
    }

    return data;
  }

  async reactivateOldParticipant(data: Participant) {
    await this.participantStore.setDeactivated(data.id, data.stream, false);
  }

  async createBotParticipant(
    bot: string,
    stream: string,
  ): Promise<Participant> {
    const botInstance = await this.botInstanceStore.create(bot, stream);

    const botParticipant: Participant = {
      ...botInstance,
      stream,
      audioEnabled: false,
      isRaisingHand: false,
      videoEnabled: false,
      role: 'streamer',
      isBanned: false,
      isBot: true,
    };

    await this.participantStore.add(botParticipant);

    this.events.emit(EVENT_NEW_PARTICIPANT, {
      participant: botParticipant,
    });

    return botParticipant;
  }

  async createNewParticipant(
    stream: string,
    userId: string,
  ): Promise<Participant> {
    const user = await this.user.findById(userId);
    const viewer: Participant = {
      ...user,
      stream,
      role: 'viewer',
      isBanned: false,
      isBot: false,
    };

    await this.participantStore.add(viewer);

    return viewer;
  }

  async getViewers(stream: string, page: number) {
    const viewers = await this.participantStore.getViewersPage(stream, page);
    return viewers;
  }

  async getParticipantDataOnStream(stream: string) {
    const [streamers, raisedHands, count] = await Promise.all([
      this.participantStore.getStreamers(stream),
      this.participantStore.getRaisedHands(stream),
      this.participantStore.count(stream),
    ]);

    return {
      streamers,
      raisedHands,
      count,
    };
  }

  async setRaiseHand(user: string, flag: boolean) {
    const participant = await this.participantStore.update(user, {
      isRaisingHand: flag,
    });
    this.events.emit(EVENT_RAISE_HAND, participant);
  }

  /**
   * Marks users as deactivated (so they can rejoin with their
   * previous role later)
   *
   * Deactivated users aren't considered stream
   * participants, but their data is preserved
   * until the stream ends or the user joins
   * a different stream
   *
   * If user is a bot, it gets removed completely
   * */
  async handleLeavingParticipant(user: string) {
    const data = await this.participantStore.get(user);

    if (!data) {
      throw new UserNotFound();
    }

    //Do nothing if the user is already deactivated
    if (await this.participantStore.isDeactivated(user, data.stream)) {
      throw new ParticipantAlreadyLeft();
    }

    this.events.emit(EVENT_PARTICIPANT_LEAVE, {
      user,
      stream: data.stream,
    });

    //remove bots from the stream completely
    //bc they can't rejoin
    if (user.slice(0, 3) === 'bot') {
      await this.removeUserFromStream(user, data.stream);
    } else {
      await this.participantStore.setDeactivated(user, data.stream, true);
    }
  }

  async removeUserFromStream(user: string, stream: string) {
    const isBot = user.slice(0, 3) === 'bot';

    let id = user;

    if (isBot) {
      const instance = await this.botInstanceStore.getBotInstance(user, stream);

      id = instance.id;
    }

    await this.participantStore.del(id);
  }

  async removeAllParticipantsFrom(stream: string) {
    return this.participantStore.removeParticipantDataFromStream(stream);
  }

  async setMediaEnabled(
    user: string,
    {
      videoEnabled,
      audioEnabled,
    }: { videoEnabled?: boolean; audioEnabled?: boolean },
  ) {
    const stream = await this.participantStore.getStreamId(user);

    const update: Partial<Participant> = {};

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
