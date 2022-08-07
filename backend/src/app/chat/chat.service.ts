import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatMessage } from '@warpy/lib';
import { EVENT_CHAT_MESSAGE } from '@warpy-be/utils';
import cuid from 'cuid';
import Filter from 'bad-words';
import { ParticipantService, ParticipantStore } from '../participant';
import { UserBlockService } from '../user-block';
import { BroadcastService } from '../broadcast';

export class ChatService {
  profanityFilter = new Filter();

  constructor(
    private events: EventEmitter2,
    private participantService: ParticipantService,
    private participantStore: ParticipantStore,
    private blockService: UserBlockService,
    private broadcastService: BroadcastService,
  ) {}

  getFilteredMessage(message: string): string {
    return this.profanityFilter.clean(message);
  }

  async sendNewMessage(userId: string, text: string) {
    const data = await this.participantService.get(userId);

    const filteredText = this.getFilteredMessage(text);

    const [participants, blockedByIds, blockedIds] = await Promise.all([
      this.participantStore.getParticipantIds(data.stream),
      this.blockService.getBlockedByIds(userId),
      this.blockService.getBlockedUserIds(userId),
    ]);

    const ids = participants.filter(
      (id) =>
        !blockedByIds.includes(id) && !blockedIds.includes(id) && id !== userId,
    );

    const message: ChatMessage = {
      id: cuid(),
      sender: data,
      message: filteredText,
      timestamp: Date.now(),
    };

    this.broadcastService.broadcast(ids, {
      event: 'chat-message',
      data: { message },
    });

    this.events.emit(EVENT_CHAT_MESSAGE, {
      message,
    });

    return message;
  }
}
