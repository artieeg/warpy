import { EventEmitter2 } from '@nestjs/event-emitter';
import { BotInstanceStore, ParticipantStore } from '@warpy-be/app';
import { UserService } from '../user';
import { Participant } from '@warpy/lib';
import {
  MaxVideoStreamers,
  NoPermissionError,
  UserNotFound,
} from '@warpy-be/errors';
import {
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_KICKED,
  EVENT_PARTICIPANT_LEAVE,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_RAISE_HAND,
  EVENT_STREAMER_MEDIA_TOGGLE,
} from '@warpy-be/utils';
import { StreamBanStore } from './stream-bans.store';

export class ParticipantService {
  constructor(
    private participantStore: ParticipantStore,
    private botInstanceStore: BotInstanceStore,
    private events: EventEmitter2,
    private user: UserService,
    private streamBanStore: StreamBanStore,
  ) {}

  async get(id: string) {
    const data = await this.participantStore.get(id);

    if (!data) {
      throw new UserNotFound();
    }

    return data;
  }

  async rejoinExistingParticipant(data: Participant) {
    await this.participantStore.setDeactivated(data.id, data.stream, false);

    this.events.emit(EVENT_PARTICIPANT_REJOIN, {
      participant: data,
    });
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

    this.events.emit(EVENT_NEW_PARTICIPANT, { participant: viewer });

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
    const participant = await this.participantStore.setRaiseHand(user, flag);
    this.events.emit(EVENT_RAISE_HAND, participant);
  }

  /**
   * Marks users as deactivated (so they can rejoin with their
   * previous role)
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
      return;
    }

    //Do nothing if the user is already deactivated
    if (await this.participantStore.isDeactivated(user, data.stream)) {
      return;
    }

    //remove bots from the stream completely
    //bc they can't rejoin
    if (user.slice(0, 3) === 'bot') {
      return this.removeUserFromStream(user, data.stream);
    }

    await this.participantStore.setDeactivated(user, data.stream, true);

    this.events.emit(EVENT_PARTICIPANT_LEAVE, {
      user,
      stream: data.stream,
    });
  }

  async isUserBanned(user: string, stream: string) {
    const ban = await this.streamBanStore.find(user, stream);

    return !!ban;
  }

  async kickStreamParticipant(userToKick: string, moderatorId: string) {
    const moderator = await this.participantStore.get(moderatorId);

    if (!moderator) {
      throw new UserNotFound();
    }

    if (moderator.role !== 'streamer') {
      throw new NoPermissionError();
    }

    const userToKickData = await this.participantStore.get(userToKick);

    if (!userToKickData) {
      throw new UserNotFound();
    }

    const stream = moderator.stream;

    if (userToKickData.stream !== stream) {
      throw new NoPermissionError();
    }

    try {
      await this.streamBanStore.create(stream, userToKick);
    } catch (e) {}

    await this.removeUserFromStream(userToKick, stream);

    this.events.emit(EVENT_PARTICIPANT_KICKED, userToKickData);
  }

  private async removeUserFromStream(user: string, stream?: string) {
    const isBot = user.slice(0, 3) === 'bot';

    let id = user;

    if (isBot) {
      const instance = await this.botInstanceStore.getBotInstance(user, stream);

      id = instance.id;
    }

    await this.deleteUserParticipant(id);
  }

  private async deleteUserParticipant(user: string) {
    try {
      await this.participantStore.del(user);
    } catch (e) {
      console.error(e);
    }
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