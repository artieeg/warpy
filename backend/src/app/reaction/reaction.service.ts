import { ALLOWED_EMOJI, Reaction } from '@warpy/lib';
import { InvalidReaction } from '@warpy-be/errors';
import { BroadcastService } from '../broadcast';
import { ParticipantStore } from '../participant';

export class ReactionService {
  private syncInterval: ReturnType<typeof setInterval>;
  batchedReactionUpdates: Record<string, Reaction[]> = {};

  constructor(
    private broadcastService: BroadcastService,
    private participantStore: ParticipantStore,
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
      throw new InvalidReaction();
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

          const ids = await this.participantStore.getParticipantIds(stream);

          this.broadcastService.broadcast(ids, {
            event: 'reactions-update',
            data: {
              stream,
              reactions,
            },
          });
        } catch (e) {}
      },
    );

    this.reset();
  }
}
