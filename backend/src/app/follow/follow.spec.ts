import { getMockedInstance } from '@warpy-be/utils';
import { FollowService } from './follow.service';
import { FollowStore } from './follow.store';

describe('FollowService', () => {
  const store = getMockedInstance<FollowStore>(FollowStore);
  const service = new FollowService(store as any);

  const follower = 'user0';
  const followed = 'user1';

  it('creates follow', async () => {
    await service.createNewFollow(follower, followed);

    expect(store.createNewFollow).toBeCalledWith(follower, followed);
  });

  it('deletes follow', async () => {
    await service.deleteFollow(follower, followed);

    expect(store.deleteFollow).toBeCalledWith(follower, followed);
  });
});
