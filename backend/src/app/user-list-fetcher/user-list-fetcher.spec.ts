import { getMockedInstance } from '@warpy-be/utils';
import { createFollowRecord, createUserFixture } from '@warpy-be/__fixtures__';
import { FollowStore } from '../follow';
import { UserBlockService } from '../user-block';
import { UserListFetcherService } from './user-list-fetcher.service';

describe('UserListFetcherService', () => {
  const followStore = getMockedInstance<FollowStore>(FollowStore);
  const blockService = getMockedInstance<UserBlockService>(UserBlockService);

  const service = new UserListFetcherService(
    followStore as any,
    blockService as any,
  );

  const followRecords = [
    createFollowRecord(),
    createFollowRecord(),
    createFollowRecord(),
  ];

  followStore.getFollowed.mockResolvedValue(followRecords);
  followStore.getFollowers.mockResolvedValue(followRecords);

  const blockedUsers = [createUserFixture()];
  blockService.getBlockedUsers.mockResolvedValue(blockedUsers);

  it('fetches blocked users', async () => {
    expect(service.getBlockedUsers('user', 0)).resolves.toStrictEqual(
      blockedUsers,
    );
  });

  it('fetches followed users', async () => {
    expect(service.getFollowing('user', 0)).resolves.toStrictEqual(
      followRecords.map((f) => f.followed),
    );
  });

  it('fetches followers', async () => {
    expect(service.getFollowers('user', 0)).resolves.toStrictEqual(
      followRecords.map((f) => f.follower),
    );
  });
});
