import { StreamNotFound, UserNotFound } from '@warpy-be/errors';
import { ParticipantStore } from '@warpy-be/user/participant';
import { UserStoreService } from '@warpy-be/user/user.store';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IChatMessage } from '@warpy/lib';
import { EVENT_CHAT_MESSAGE } from '@warpy-be/utils';

import cuid from 'cuid';
import Filter from 'bad-words';
import { BlockService } from '@warpy-be/block/block.service';

@Injectable()
export class ChatService {
  profanityFilter = new Filter();

  constructor(
    private eventEmitter: EventEmitter2,
    private userEntity: UserStoreService,
    private participantEntity: ParticipantStore,
    private blockService: BlockService,
  ) {}

  getFilteredMessage(message: string): string {
    return this.profanityFilter.clean(message);
  }

  async sendNewMessage(userId: string, text: string) {
    const user = await this.userEntity.find(userId);

    if (!user) {
      throw new UserNotFound();
    }

    const stream = await this.participantEntity.getStreamId(userId);

    if (!stream) {
      throw new StreamNotFound();
    }

    const filteredText = this.getFilteredMessage(text);

    const [participants, blockedByIds, blockedIds] = await Promise.all([
      this.participantEntity.getParticipantIds(stream),
      this.blockService.getBlockedByIds(userId),
      this.blockService.getBlockedUserIds(userId),
    ]);

    const ids = participants.filter(
      (id) => !blockedByIds.includes(id) && !blockedIds.includes(id),
    );

    const message: IChatMessage = {
      id: cuid(),
      sender: user,
      message: filteredText,
      timestamp: Date.now(),
    };

    this.eventEmitter.emit(EVENT_CHAT_MESSAGE, {
      idsToBroadcast: ids,
      message,
    });

    return message;
  }
}
