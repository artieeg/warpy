import {
  createAwardFixture,
  createAwardModelFixture,
} from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
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
      .compile();

    awardService = m.get(AwardService);
  });

  describe('sending an award', () => {
    const createdAwardRecord = createAwardFixture({});
    const { sender, recipent, award } = createdAwardRecord;

    beforeAll(async () => {
      mockedAwardEntity.create.mockResolvedValue(createdAwardRecord);
    });

    it('creates a database record', async () => {
      await awardService.sendAward(sender.id, recipent.id, award.id);

      expect(mockedAwardEntity.create).toBeCalledWith(
        sender.id,
        recipent.id,
        award.id,
      );
    });

    it.todo('emits an event with the newly created award');

    it.todo('checks senders coin balance');

    it.todo('deducts coins from the senders balance');
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
