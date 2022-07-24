import { FollowRecord, PrismaClient, User as PrismaUser } from '@prisma/client';
import { User } from '@warpy/lib';
import { toUserDTO } from '../user';

export interface IFollow {
  follower_id: string;
  followed_id: string;
  follower?: User;
  followed?: User;
}

export function toFollowDTO(
  data: FollowRecord & { followed?: PrismaUser } & { follower?: PrismaUser },
): IFollow {
  let followData: IFollow = {
    followed_id: data.followed_id,
    follower_id: data.follower_id,
    followed: data.followed && toUserDTO(data.followed),
    follower: data.follower && toUserDTO(data.follower),
  };

  return followData;
}

export class FollowStore {
  constructor(private prisma: PrismaClient) {}

  async createNewFollow(follower: string, followed: string): Promise<IFollow> {
    const follow = await this.prisma.followRecord.create({
      data: {
        follower_id: follower,
        followed_id: followed,
      },
    });

    return toFollowDTO(follow);
  }

  async deleteFollow(follower: string, followed: string): Promise<void> {
    await this.prisma.followRecord.delete({
      where: {
        unique_follow_index: {
          followed_id: followed,
          follower_id: follower,
        },
      },
    });
  }

  async getFollowed(user: string): Promise<IFollow[]> {
    const followers = await this.prisma.followRecord.findMany({
      where: {
        follower_id: user,
      },
      include: {
        followed: true,
      },
    });

    return followers.map(toFollowDTO);
  }

  async getFollowers(user: string): Promise<IFollow[]> {
    const followers = await this.prisma.followRecord.findMany({
      where: {
        followed_id: user,
      },
      include: {
        follower: true,
      },
    });

    return followers.map(toFollowDTO);
  }

  async getFollowedUserIds(user: string): Promise<string[]> {
    const followed = await this.prisma.followRecord.findMany({
      where: {
        follower_id: user,
      },
      select: {
        followed_id: true,
      },
    });

    return followed.map((data) => data.followed_id);
  }

  async isFollowing(
    follower_id: string,
    followed_id: string,
  ): Promise<boolean> {
    const record = await this.prisma.followRecord.findFirst({
      where: {
        follower_id,
        followed_id,
      },
      select: {
        id: true,
      },
    });

    return !!record;
  }
}
