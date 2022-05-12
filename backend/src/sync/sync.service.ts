import { Injectable } from '@nestjs/common';
import { UserNotFound } from '@warpy-be/errors';
import { CategoriesEntity } from '@warpy-be/stream/categories/categories.entity';
import { AppliedAppInviteEntity } from '@warpy-be/user/app_invite/applied-app-invite.entity';
import { FriendFeedService } from '@warpy-be/user/friend_feed/friend_feed.service';
import { UserService } from '@warpy-be/user/user.service';
import { IWhoAmIResponse } from '@warpy/lib';

@Injectable()
export class SyncService {
  constructor(
    private userService: UserService,
    private appliedAppInviteEntity: AppliedAppInviteEntity,
    private categoriesEntity: CategoriesEntity,
    private friendFeed: FriendFeedService,
  ) {}

  async sync(user: string): Promise<IWhoAmIResponse> {
    const [data, hasActivatedAppInvite, categories, friendFeed, following] =
      await Promise.all([
        this.userService.findById(user, true),
        this.appliedAppInviteEntity.find(user),
        this.categoriesEntity.getAll(),
        this.friendFeed.getFriendFeed(user),
        this.userService.getFollowing(user, 0),
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
