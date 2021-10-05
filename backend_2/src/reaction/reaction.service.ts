import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ALLOWED_EMOJI, Reaction } from '@warpy/lib';
import { StreamEntity } from '../stream/stream.entity';

@Injectable()
export class ReactionService implements OnModuleInit {
  batchedReactionUpdates: Record<string, Reaction[]> = {};

  constructor(
    private eventEmitter: EventEmitter2,
    private streamEntity: StreamEntity,
  ) {}

  reset() {
    Object.keys(this.batchedReactionUpdates).forEach((key) => {
      this.batchedReactionUpdates[key] = [];
    });
  }

  onModuleInit() {
    setInterval(() => this.syncReactions(), 1000);
  }

  async countNewReaction(
    user: string,
    emoji: string,
    stream: string,
  ): Promise<void> {
    if (!ALLOWED_EMOJI.includes(emoji)) {
      return;
    }

    if (!this.batchedReactionUpdates[stream]) {
      this.batchedReactionUpdates[stream] = [{ emoji, user }];
    } else {
      this.batchedReactionUpdates[stream].push({ emoji, user });
    }
  }

  async syncReactions() {
    Object.entries(this.batchedReactionUpdates).forEach(
      async ([stream, reactions]) => {
        try {
          if (reactions.length === 0) {
            return;
          }

          this.eventEmitter.emit('reactions', { stream, reactions });
          await this.streamEntity.incReactionsCount(stream, reactions.length);
        } catch (e) {
          console.error(e);
        }
      },
    );

    this.reset();
  }
}
