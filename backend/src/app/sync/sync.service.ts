import { WhoAmIResponse } from '@warpy/lib';
import { CategoryStore } from '@warpy-be/app/category';
import { AppliedAppInviteStore } from '@warpy-be/app/app-invite';
import { UserService } from '@warpy-be/app/user';
import { IUserListFetcherService } from '@warpy-be/app/user-list-fetcher';
import { FriendFeedService } from '@warpy-be/app/friend-feed';

export class SyncService {
  constructor(
    private userService: UserService,
    private appliedAppInviteStore: AppliedAppInviteStore,
    private categoryStore: CategoryStore,
    private friendFeedService: FriendFeedService,
    private userListService: IUserListFetcherService,
  ) {}

  async sync(user: string): Promise<WhoAmIResponse> {
    const [data, hasActivatedAppInvite, categories, friendFeed, following] =
      await Promise.all([
        this.userService.findById(user, true),
        this.appliedAppInviteStore.find(user),
        this.categoryStore.getAll(),
        this.friendFeedService.getFriendFeed(user),
        this.userListService.getFollowing(user, 0),
      ]);

    return {
      user: data,
      following,
      friendFeed,
      hasActivatedAppInvite: !!hasActivatedAppInvite,
      categories,
    };
  }
}
