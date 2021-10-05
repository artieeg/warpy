import { BlockEntity } from '@backend_2/block/block.entity';
import { StreamNotFound, UserNotFound } from '@backend_2/errors';
import { ParticipantEntity } from '@backend_2/participant/participant.entity';
import { UserEntity } from '@backend_2/user/user.entity';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IChatMessage } from '@warpy/lib';
const cuid = require('cuid');
import Filter from 'bad-words';

console.log(Filter);

@Injectable()
export class ChatService {
  //profanityFilter = new Filter();

  constructor(
    private eventEmitter: EventEmitter2,
    private userEntity: UserEntity,
    private participantEntity: ParticipantEntity,
    private blockEntity: BlockEntity,
  ) {}

  getFilteredMessage(message: string): string {
    return message;
    //return this.profanityFilter.clean(message);
  }

  async sendNewMessage(userId: string, text: string) {
    const user = await this.userEntity.findById(userId);

    if (!user) {
      throw new UserNotFound();
    }

    const stream = await this.participantEntity.getCurrentStreamFor(userId);

    const filteredText = this.getFilteredMessage(text);

    if (!stream) {
      throw new StreamNotFound();
    }

    const participants = await this.participantEntity.getIdsByStream(stream);
    const blockedByIds = await this.blockEntity.getBlockedByIds(userId);
    const blockedIds = await this.blockEntity.getBlockedUserIds(userId);

    const ids = participants.filter(
      (id) => !blockedByIds.includes(id) && !blockedIds.includes(id),
    );

    const message: IChatMessage = {
      id: cuid(),
      sender: user,
      message: filteredText,
      timestamp: Date.now(),
    };

    this.eventEmitter.emit('chat.message', { idsToBroadcast: ids, message });

    return message;
  }
}
