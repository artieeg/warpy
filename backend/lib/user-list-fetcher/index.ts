import { IUser } from '@warpy/lib';
import { IFollowStore, IUserBlockService } from 'lib';

export interface IUserListFetcherService {
  getFollowers(user: string, _page: number): Promise<IUser[]>;
  getFollowing(user: string, _page: number): Promise<IUser[]>;
  getBlockedUsers(user: string, _page: number): Promise<IUser[]>;
}

export class UserListFetcherService implements IUserListFetcherService {
  constructor(
    private followEntity: IFollowStore,
    private blockService: IUserBlockService,
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
