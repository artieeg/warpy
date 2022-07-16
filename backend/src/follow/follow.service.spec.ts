import { createFollowRecord } from '@warpy-be/__fixtures__';
import { testModuleBuilder } from '@warpy-be/__fixtures__/app.module';
import { NjsFollowStore } from './follow.entity';
import { mockedFollowEntity } from './follow.entity.mock';
import { NjsFollowService } from './follow.service';

describe('FollowService', () => {
  let followService: NjsFollowService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(NjsFollowStore)
      .useValue(mockedFollowEntity)
      .compile();

    followService = m.get(NjsFollowService);
  });

  it('creates new follow', async () => {
    const mockedFollow = createFollowRecord({});
    mockedFollowEntity.createNewFollow.mockResolvedValueOnce(mockedFollow);

    expect(
      followService.createNewFollow(
        mockedFollow.follower_id,
        mockedFollow.followed_id,
      ),
    ).resolves.toStrictEqual(mockedFollow);
  });

  it('deletes a follow', async () => {
    await followService.deleteFollow('test', 'test2');

    expect(mockedFollowEntity.deleteFollow).toBeCalledWith('test', 'test2');
  });
});
