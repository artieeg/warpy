import { UserNotFound } from '@warpy-be/errors';
import { IWhoAmIResponse } from '@warpy/lib';
import {
  IAppliedAppInviteStore,
  ICategoryStore,
  IFriendFeedService,
  IUserListFetcherService,
  IUserService,
} from 'lib';

export interface ISyncService {
  sync(user: string): Promise<IWhoAmIResponse>;
}

export class SyncService implements ISyncService {
  constructor(
    private userService: IUserService,
    private appliedAppInviteEntity: IAppliedAppInviteStore,
    private categoriesEntity: ICategoryStore,
    private friendFeed: IFriendFeedService,
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
