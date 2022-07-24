import { UserNotFound } from '@warpy-be/errors';
import { IWhoAmIResponse } from '@warpy/lib';
import { CategoryStore } from '@warpy-be/app/category';
import { AppliedAppInviteStore } from '@warpy-be/app/app-invite';
import { UserService } from '@warpy-be/app/user';
import { IUserListFetcherService } from '@warpy-be/app/user-list-fetcher';
import { FriendFeedService } from '@warpy-be/app/friend-feed';

export class SyncService {
  constructor(
    private userService: UserService,
    private appliedAppInviteEntity: AppliedAppInviteStore,
    private categoriesEntity: CategoryStore,
    private friendFeed: FriendFeedService,
    private userListService: IUserListFetcherService,
  ) {}

  async sync(user: string): Promise<IWhoAmIResponse> {
    const [data, hasActivatedAppInvite, categories, friendFeed, following] =
      await Promise.all([
        this.userService.findById(user, true),
        this.appliedAppInviteEntity.find(user),
        this.categoriesEntity.getAll(),
        this.friendFeed.getFriendFeed(user),
        this.userListService.getFollowing(user, 0),
      ]);

    if (!data) {
      throw new UserNotFound();
    }

    return {
      user: data,
      following,
      friendFeed,
      hasActivatedAppInvite: !!hasActivatedAppInvite,
      categories,
    };
  }
}
