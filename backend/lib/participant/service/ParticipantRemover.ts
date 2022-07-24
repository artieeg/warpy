import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_PARTICIPANT_LEAVE } from '@warpy-be/utils';
import { IBotInstanceStore, IParticipantStore } from 'lib';

export interface ParticipantRemover {
  handleLeavingParticipant(user: string): Promise<void>;
  removeUserFromStream(user: string, stream?: string): Promise<void>;
  removeAllParticipantsFrom(stream: string): Promise<void>;
}

export class ParticipantRemoverImpl implements ParticipantRemover {
  constructor(
    private botInstanceStore: IBotInstanceStore,
    private events: EventEmitter2,
    private participantStore: IParticipantStore,
  ) {}

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

    //remove bots from the stream completely
    //since they can't rejoin
    if (user.slice(0, 3) === 'bot') {
      return this.removeUserFromStream(user, data.stream);
    }

    await this.participantStore.setDeactivated(user, data.stream, true);

    this.events.emit(EVENT_PARTICIPANT_LEAVE, {
      user,
      stream: data.stream,
    });
  }

  async handleRejoiningUser(user: string, stream: string) {
    await this.participantStore.setDeactivated(user, stream, false);
  }

  async removeUserFromStream(user: string, stream?: string) {
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
}
