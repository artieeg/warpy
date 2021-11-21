import { CoinBalanceEntity } from '@backend_2/coin-balance/coin-balance.entity';
import { mockedCoinBalanceEntity } from '@backend_2/coin-balance/coin-balance.entity.mock';
import { NotEnoughCoins } from '@backend_2/errors';
import { mockedEventEmitter } from '@backend_2/events/events.service.mock';
import {
  createAwardFixture,
  createAwardModelFixture,
} from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AwardModelEntity } from './award-model.entity';
import { mockedAwardModelEntity } from './award-model.entity.mock';
import { AwardEntity } from './award.entity';
import { mockedAwardEntity } from './award.entity.mock';
import { AwardService } from './award.service';

describe('AwardService', () => {
  let awardService: AwardService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(AwardModelEntity)
      .useValue(mockedAwardModelEntity)
      .overrideProvider(AwardEntity)
      .useValue(mockedAwardEntity)
      .overrideProvider(EventEmitter2)
      .useValue(mockedEventEmitter)
      .overrideProvider(CoinBalanceEntity)
      .useValue(mockedCoinBalanceEntity)
      .compile();

    awardService = m.get(AwardService);
  });

  describe('fetching received awards', () => {
    const awards = [
      createAwardFixture({}),
      createAwardFixture({}),
      createAwardFixture({}),
    ];

    it('returns received awards', () => {
      mockedAwardEntity.getByRecipent.mockResolvedValueOnce(awards);

      expect(awardService.getReceivedAwards('user')).resolves.toStrictEqual(
        awards,
      );
    });
  });

  describe('sending an award', () => {
    const createdAwardRecord = createAwardFixture({});
    const { sender, message, recipent, award } = createdAwardRecord;

    beforeAll(async () => {
      mockedAwardEntity.create.mockResolvedValue(createdAwardRecord);
      mockedAwardModelEntity.find.mockResolvedValue(award);
      mockedCoinBalanceEntity.check.mockResolvedValue(true);
    });

    it('creates a database record', async () => {
      await awardService.sendAward(sender.id, recipent.id, award.id, message);

      expect(mockedAwardEntity.create).toBeCalledWith(
        sender.id,
        recipent.id,
        award.id,
        message,
      );
    });

    it('emits an event with the newly created award', async () => {
      await awardService.sendAward(sender.id, recipent.id, award.id, message);

      expect(mockedEventEmitter.emit).toBeCalledWith('award.sent', {
        award: createdAwardRecord,
      });
    });

    it('checks senders coin balance', () => {
      mockedCoinBalanceEntity.check.mockResolvedValueOnce(false);
      expect(
        awardService.sendAward(sender.id, recipent.id, award.id, message),
      ).rejects.toThrowError(NotEnoughCoins);
    });

    it('deducts coins from the senders balance', async () => {
      await awardService.sendAward(sender.id, recipent.id, award.id, message);

      expect(mockedCoinBalanceEntity.updateBalance).toBeCalledWith(
        sender.id,
        -award.price,
      );
    });
  });

  it('fetches available awards', async () => {
    const mockedAwardModels = [
      createAwardModelFixture({}),
      createAwardModelFixture({}),
      createAwardModelFixture({}),
    ];

    mockedAwardModelEntity.getAvailableAwards.mockResolvedValueOnce(
      mockedAwardModels,
    );

    expect(awardService.getAvailableAwards()).resolves.toStrictEqual(
      mockedAwardModels,
    );
  });
});
