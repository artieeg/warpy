import { getMockedInstance } from '@warpy-be/utils';
import {
  createCategoryFixture,
  createFriendFeedItemFixture,
  createUserFixture,
} from '@warpy-be/__fixtures__';
import { AppliedAppInviteStore } from '../app-invite';
import { CategoryStore } from '../category';
import { FriendFeedService } from '../friend-feed';
import { UserService } from '../user';
import { UserListFetcherService } from '../user-list-fetcher';
import { SyncService } from './sync.service';

describe('SyncService', () => {
  const userService = getMockedInstance<UserService>(UserService);
  const appliedAppInviteStore = getMockedInstance<AppliedAppInviteStore>(
    AppliedAppInviteStore,
  );
  const categoryStore = getMockedInstance<CategoryStore>(CategoryStore);
  const friendFeedService =
    getMockedInstance<FriendFeedService>(FriendFeedService);
  const userListService = getMockedInstance<UserListFetcherService>(
    UserListFetcherService,
  );

  const service = new SyncService(
    userService as any,
    appliedAppInviteStore as any,
    categoryStore as any,
    friendFeedService as any,
    userListService as any,
  );

  const user = createUserFixture({ id: 'sync-user0' });
  const hasActivatedAppInvite = false;
  const categories = [createCategoryFixture()];
  const friendFeed = [createFriendFeedItemFixture()];
  const followedUsers = [createUserFixture()];

  userService.findById.mockResolvedValue(user);
  appliedAppInviteStore.find.mockResolvedValue(null);
  categoryStore.getAll.mockResolvedValue(categories);
  friendFeedService.getFriendFeed.mockResolvedValue(friendFeed);
  userListService.getFollowing.mockResolvedValue(followedUsers);

  it('syncs user data', () => {
    expect(service.sync(user.id)).resolves.toStrictEqual(
      expect.objectContaining({
        user,
        following: followedUsers,
        friendFeed,
        hasActivatedAppInvite,
        categories,
      }),
    );
  });
});
