import { prisma } from "./client";
import { FollowRecord, User } from "@prisma/client";
import { IUser, toUserDTO } from "./user_dal";

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
  };

  if (data.follower && data.followed) {
    followData = {
      ...followData,
      followed: toUserDTO(data.followed),
      follower: toUserDTO(data.followed),
    };
  }

  return followData;
};

export const FollowRecordDAL = {
  async createNewFollow(follower: string, followed: string): Promise<IFollow> {
    const follow = await prisma.followRecord.create({
      data: {
        follower_id: follower,
        followed_id: followed,
      },
    });

    return toFollowDTO(follow);
  },

  async deleteFollow(follower: string, followed: string): Promise<IFollow> {
    const follow = await prisma.followRecord.delete({
      where: {
        unique_follow_index: {
          followed_id: followed,
          follower_id: follower,
        },
      },
    });

    return toFollowDTO(follow);
  },
};
