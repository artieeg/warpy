import { Injectable } from '@nestjs/common';
import { NjsBlockService } from '@warpy-be/block/block.service';
import { NjsFollowStore } from '@warpy-be/follow/follow.entity';
import { IUser } from '@warpy/lib';

@Injectable()
export class UserListService {
  constructor(
    private followEntity: NjsFollowStore,
    private blockService: NjsBlockService,
  ) {}

  async getFollowers(user: string, _page: number): Promise<IUser[]> {
    const followers = await this.followEntity.getFollowers(user);

    return followers.map((f) => f.follower);
  }

  async getFollowing(user: string, _page: number): Promise<IUser[]> {
    const records = await this.followEntity.getFollowed(user);

    if (records.length === 0) {
      return [];
    }

    const following = records.map((f) => f.followed);

    return following;
  }

  async getBlockedUsers(user: string, _page: number) {
    return this.blockService.getBlockedUsers(user, 0);
  }
}
