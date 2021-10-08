import { createFollowRecord } from '@backend_2/__fixtures__';
import { testModuleBuilder } from '@backend_2/__fixtures__/app.module';
import { FollowEntity } from './follow.entity';
import { mockedFollowEntity } from './follow.entity.mock';
import { FollowService } from './follow.service';

describe('FollowService', () => {
  let followService: FollowService;

  beforeAll(async () => {
    const m = await testModuleBuilder
      .overrideProvider(FollowEntity)
      .useValue(mockedFollowEntity)
      .compile();

    followService = m.get(FollowService);
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
