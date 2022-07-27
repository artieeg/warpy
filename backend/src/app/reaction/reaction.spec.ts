import { EventEmitter2 } from '@nestjs/event-emitter';
import { InvalidReaction } from '@warpy-be/errors';
import { EVENT_REACTIONS, getMockedInstance } from '@warpy-be/utils';
import { ALLOWED_EMOJI } from '@warpy/lib';
import { ReactionService } from './reaction.service';

describe('ReactionService', () => {
  const events = getMockedInstance<EventEmitter2>(EventEmitter2);
  const service = new ReactionService(events as any);

  const reaction = ALLOWED_EMOJI[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('counting new reaction', () => {
    const invalidReaction = 'invalid_reaction';

    it('counts new reaction', async () => {
      await service.countNewReaction('user', reaction, 'stream');
      await service.countNewReaction('user2', reaction, 'stream');
      expect(service.batchedReactionUpdates['stream']).toHaveLength(2);
    });

    it('throws if reaction is invalid', async () => {
      expect(
        service.countNewReaction('user', invalidReaction, 'stream'),
      ).rejects.toThrowError(InvalidReaction);
    });
  });

  describe('syncing reactions', () => {
    it('does nothing if no reactions', async () => {
      service.batchedReactionUpdates = {};
      await service.syncReactions();

      expect(events.emit).toBeCalledTimes(0);
    });

    it('emits reactions event', async () => {
      await service.countNewReaction('user', reaction, 'stream');
      await service.syncReactions();

      expect(events.emit).toBeCalledWith(EVENT_REACTIONS, expect.anything());
    });
  });
});
