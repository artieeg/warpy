import { prisma, runPrismaQuery } from "./client";
import { FollowRecord, User } from "@prisma/client";
import { toUserDTO } from "./user_dal";
import { IUser } from "@warpy/lib";

export interface IFollow {
  follower_id: string;
  followed_id: string;
  follower?: IUser;
  followed?: IUser;
}

export const toFollowDTO = (
  data: FollowRecord & { followed?: User } & { follower?: User }
): IFollow => {
  let followData: IFollow = {
    followed_id: data.followed_id,
    follower_id: data.follower_id,
    followed: data.followed && toUserDTO(data.followed),
    follower: data.follower && toUserDTO(data.follower),
  };

  return followData;
};

export const FollowRecordDAL = {
  async createNewFollow(follower: string, followed: string): Promise<IFollow> {
    const follow = await runPrismaQuery(() =>
      prisma.followRecord.create({
        data: {
          follower_id: follower,
          followed_id: followed,
        },
      })
    );

    return toFollowDTO(follow);
  },

  async deleteFollow(follower: string, followed: string): Promise<void> {
    await runPrismaQuery(() =>
      prisma.followRecord.delete({
        where: {
          unique_follow_index: {
            followed_id: followed,
            follower_id: follower,
          },
        },
      })
    );
  },

  async getFollowed(user: string): Promise<IFollow[]> {
    const followers = await runPrismaQuery(() =>
      prisma.followRecord.findMany({
        where: {
          follower_id: user,
        },
        include: {
          followed: true,
        },
      })
    );

    return followers.map(toFollowDTO);
  },

  async getFollowers(user: string): Promise<IFollow[]> {
    const followers = await runPrismaQuery(() =>
      prisma.followRecord.findMany({
        where: {
          followed_id: user,
        },
        include: {
          follower: true,
        },
      })
    );

    return followers.map(toFollowDTO);
  },

  async getFollowedUserIds(user: string): Promise<string[]> {
    const followed = await runPrismaQuery(() =>
      prisma.followRecord.findMany({
        where: {
          follower_id: user,
        },
        select: {
          followed_id: true,
        },
      })
    );

    return followed.map((data) => data.followed_id);
  },
};
