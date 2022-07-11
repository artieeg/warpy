import { Injectable } from '@nestjs/common';
import { FollowStore, IFollow } from './follow.entity';

@Injectable()
export class FollowService {
  constructor(private followEntity: FollowStore) {}

  async createNewFollow(
    follower: string,
    userToFollow: string,
  ): Promise<IFollow> {
    const follow = await this.followEntity.createNewFollow(
      follower,
      userToFollow,
    );

    return follow;
  }

  async deleteFollow(follower: string, userToUnfollow: string): Promise<void> {
    await this.followEntity.deleteFollow(follower, userToUnfollow);
  }
}
