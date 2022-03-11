import { StreamEntity } from '@backend_2/stream/common/stream.entity';
import { EVENT_REACTIONS } from '@backend_2/utils';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ALLOWED_EMOJI, Reaction } from '@warpy/lib';

@Injectable()
export class ReactionService implements OnModuleInit, OnModuleDestroy {
  syncInterval: ReturnType<typeof setInterval>;
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
    this.syncInterval = setInterval(() => this.syncReactions(), 1000);
  }

  onModuleDestroy() {
    clearInterval(this.syncInterval);
    this.syncInterval = null;
  }

  async countNewReaction(
    user: string,
    emoji: string,
    stream: string,
  ): Promise<void> {
    if (!ALLOWED_EMOJI.includes(emoji)) {
      throw new Error();
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

          this.eventEmitter.emit(EVENT_REACTIONS, { stream, reactions });
          await this.streamEntity.incReactionsCount(stream, reactions.length);
        } catch (e) {}
      },
    );

    this.reset();
  }
}
