import { IFollow, FollowStore } from './follow.store';

export class FollowService {
  constructor(private followStore: FollowStore) {}

  async createNewFollow(
    follower: string,
    userToFollow: string,
  ): Promise<IFollow> {
    const follow = await this.followStore.createNewFollow(
      follower,
      userToFollow,
    );

    return follow;
  }

  async deleteFollow(follower: string, userToUnfollow: string): Promise<void> {
    await this.followStore.deleteFollow(follower, userToUnfollow);
  }
}
