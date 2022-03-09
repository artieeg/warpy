import { StreamNotFound, UserNotFound } from '@backend_2/errors';
import { ParticipantEntity } from '@backend_2/user/participant/common/participant.entity';
import { BlockEntity } from '@backend_2/user/block/block.entity';
import { UserEntity } from '@backend_2/user/user.entity';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IChatMessage } from '@warpy/lib';
import cuid from 'cuid';
import Filter from 'bad-words';
import { BlockService } from '@backend_2/user/block/block.service';

@Injectable()
export class ChatService {
  profanityFilter = new Filter();

  constructor(
    private eventEmitter: EventEmitter2,
    private userEntity: UserEntity,
    private participantEntity: ParticipantEntity,
    private blockService: BlockService,
  ) {}

  getFilteredMessage(message: string): string {
    return this.profanityFilter.clean(message);
  }

  async sendNewMessage(userId: string, text: string) {
    const user = await this.userEntity.findById(userId);

    if (!user) {
      throw new UserNotFound();
    }

    const stream = await this.participantEntity.getCurrentStreamFor(userId);

    if (!stream) {
      throw new StreamNotFound();
    }

    const filteredText = this.getFilteredMessage(text);

    const [participants, blockedByIds, blockedIds] = await Promise.all([
      this.participantEntity.getIdsByStream(stream),
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

    this.eventEmitter.emit('chat.message', { idsToBroadcast: ids, message });

    return message;
  }
}