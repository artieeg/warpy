import { User } from '@warpy/lib';
import { FollowStore, UserBlockService } from '@warpy-be/app';

export interface IUserListFetcherService {
  getFollowers(user: string, _page: number): Promise<User[]>;
  getFollowing(user: string, _page: number): Promise<User[]>;
  getBlockedUsers(user: string, _page: number): Promise<User[]>;
}

export class UserListFetcherService {
  constructor(
    private followEntity: FollowStore,
    private blockService: UserBlockService,
  ) {}

  async getFollowers(user: string, _page: number): Promise<User[]> {
    const followers = await this.followEntity.getFollowers(user);

    return followers.map((f) => f.follower);
  }

  async getFollowing(user: string, _page: number): Promise<User[]> {
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
