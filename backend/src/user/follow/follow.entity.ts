import { PrismaService } from '@backend_2/prisma/prisma.service';
import { UserEntity } from '@backend_2/user/user.entity';
import { Injectable } from '@nestjs/common';
import { FollowRecord, User } from '@prisma/client';
import { IUser } from '@warpy/lib';

export interface IFollow {
  follower_id: string;
  followed_id: string;
  follower?: IUser;
  followed?: IUser;
}

@Injectable()
export class FollowEntity {
  constructor(private prisma: PrismaService) {}
  static toFollowDTO = (
    data: FollowRecord & { followed?: User } & { follower?: User },
  ): IFollow => {
    let followData: IFollow = {
      followed_id: data.followed_id,
      follower_id: data.follower_id,
      followed: data.followed && UserEntity.toUserDTO(data.followed),
      follower: data.follower && UserEntity.toUserDTO(data.follower),
    };

    return followData;
  };

  async createNewFollow(follower: string, followed: string): Promise<IFollow> {
    const follow = await this.prisma.followRecord.create({
      data: {
        follower_id: follower,
        followed_id: followed,
      },
    });

    return FollowEntity.toFollowDTO(follow);
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

    return followers.map(FollowEntity.toFollowDTO);
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

    return followers.map(FollowEntity.toFollowDTO);
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
