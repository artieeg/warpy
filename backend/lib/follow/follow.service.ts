import { IFollow, IFollowStore } from './follow.store';

export interface IFollowService {
  createNewFollow(follower: string, userToFollow: string): Promise<IFollow>;
}

export class FollowService implements IFollowService {
  constructor(private followEntity: IFollowStore) {}

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
