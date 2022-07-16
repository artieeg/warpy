import { EVENT_REACTIONS } from '@warpy-be/utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ALLOWED_EMOJI, Reaction } from '@warpy/lib';
import { OnInstanceInit } from 'lib/OnInstanceInit.interface';
import { OnInstanceDestroy } from 'lib/OnInstanceDestroy';
import { IStreamStore } from 'lib';

export interface IReactionService extends OnInstanceInit, OnInstanceDestroy {
  reset(): void;
  countNewReaction(user: string, emoji: string, stream: string): Promise<void>;
  syncReactions(): void;
}

export class ReactionService implements IReactionService {
  private syncInterval: ReturnType<typeof setInterval>;
  private batchedReactionUpdates: Record<string, Reaction[]> = {};

  constructor(
    private eventEmitter: EventEmitter2,
    private streamStore: IStreamStore,
  ) {}

  onInstanceInit() {
    this.syncInterval = setInterval(() => this.syncReactions(), 1000);
  }

  onInstanceDestroy() {
    clearInterval(this.syncInterval);
    this.syncInterval = null;
  }

  reset() {
    Object.keys(this.batchedReactionUpdates).forEach((key) => {
      this.batchedReactionUpdates[key] = [];
    });
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
          await this.streamStore.incReactionsCount(stream, reactions.length);
        } catch (e) {}
      },
    );

    this.reset();
  }
}
