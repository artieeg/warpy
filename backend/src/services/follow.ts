import { IFollow } from "@backend/dal/follow_record_dal";
import { FollowRecordDAL } from "@backend/dal";
import EventEmitter from "events";

type FollowCreatedCallback = (follow?: IFollow) => void | Promise<void>;
type FollowDeletedCallback = FollowCreatedCallback;

const observer = new EventEmitter();

export const FollowService = {
  async createNewFollow(
    follower: string,
    userToFollow: string
  ): Promise<IFollow | null> {
    try {
      const follow = await FollowRecordDAL.createNewFollow(
        follower,
        userToFollow
      );

      observer.emit("follow-created", follow);

      return follow;
    } catch (e) {
      return null;
    }
  },

  async deleteFollow(follower: string, userToUnfollow: string): Promise<void> {
    const follow = await FollowRecordDAL.deleteFollow(follower, userToUnfollow);

    observer.emit("follow-deleted", follow);
  },

  onFollowCreated(cb: FollowCreatedCallback): void {
    observer.on("follow-created", cb);
  },

  onFollowDeleted(cb: FollowDeletedCallback): void {
    observer.on("follow-deleted", cb);
  },
};
