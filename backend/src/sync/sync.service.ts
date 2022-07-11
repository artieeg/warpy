import { Injectable } from '@nestjs/common';
import { CategoriesEntity } from '@warpy-be/categories/categories.entity';
import { UserNotFound } from '@warpy-be/errors';
import { FriendFeedService } from '@warpy-be/friend_feed/friend_feed.service';
import { UserListService } from '@warpy-be/user-list/user-list.service';
import { AppliedAppInviteEntity } from '@warpy-be/user/app_invite/applied-app-invite.entity';
import { UserService } from '@warpy-be/user/user.service';
import { IWhoAmIResponse } from '@warpy/lib';

@Injectable()
export class SyncService {
  constructor(
    private userService: UserService,
    private appliedAppInviteEntity: AppliedAppInviteEntity,
    private categoriesEntity: CategoriesEntity,
    private friendFeed: FriendFeedService,
    private userListService: UserListService,
  ) {}

  async sync(user: string): Promise<IWhoAmIResponse> {
    const [data, hasActivatedAppInvite, categories, friendFeed, following] =
      await Promise.all([
        this.userService.find(user, true),
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
