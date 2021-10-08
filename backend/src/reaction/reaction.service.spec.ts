import { mockedEventEmitter } from '@backend_2/events/events.service.mock';
import { StreamEntity } from '@backend_2/stream/stream.entity';
import { mockedStreamEntity } from '@backend_2/stream/stream.entity.mock';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ALLOWED_EMOJI } from '@warpy/lib';
import { ReactionService } from './reaction.service';

describe('ReactionService', () => {
  let reactionService: ReactionService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(StreamEntity)
      .useValue(mockedStreamEntity)
      .overrideProvider(EventEmitter2)
      .useValue(mockedEventEmitter)
      .compile();

    reactionService = m.get(ReactionService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an interval for syncing reactions', () => {
    reactionService.onModuleInit();

    expect(reactionService.syncInterval).toBeTruthy();
  });

  it('clears interval on module destroy', () => {
    reactionService.onModuleDestroy();

    expect(reactionService.syncInterval).toBeNull();
  });

  it('checks if reaction is allowed', async () => {
    const reaction = 'invalid';

    expect(
      reactionService.countNewReaction('test', reaction, 'test-stream'),
    ).rejects.toThrow();
  });

  it('adds reactions', async () => {
    const reaction = ALLOWED_EMOJI[0];
    const reaction2 = ALLOWED_EMOJI[2];

    await reactionService.countNewReaction('user', reaction, 'stream');
    await reactionService.countNewReaction('user', reaction2, 'stream');

    expect(reactionService.batchedReactionUpdates['stream']).toEqual(
      expect.arrayContaining([expect.objectContaining({ emoji: reaction2 })]),
    );
  });

  it('syncs reactions', async () => {
    const reaction = ALLOWED_EMOJI[0];

    await reactionService.countNewReaction('user', reaction, 'stream');
    await reactionService.syncReactions();

    expect(mockedEventEmitter.emit).toBeCalled();
    expect(mockedStreamEntity.incReactionsCount).toBeCalled();
  });

  it('does not sync reactions when there are none', async () => {
    reactionService.batchedReactionUpdates = {};
    await reactionService.syncReactions();

    expect(mockedEventEmitter.emit).not.toBeCalled();
    expect(mockedStreamEntity.incReactionsCount).not.toBeCalled();
  });
});
