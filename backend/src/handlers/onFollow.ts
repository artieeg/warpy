import { FollowService } from "@backend/services/follow";
import { IFollowRequest, IFollowResponse, MessageHandler } from "@warpy/lib";

export const onFollow: MessageHandler<IFollowRequest, IFollowResponse | any> =
  async (data, respond) => {
    const { user, userToFollow } = data;

    const follow = await FollowService.createNewFollow(user, userToFollow);

    if (follow) {
      respond({
        followedUser: follow.followed_id,
      });
    } else {
      respond({
        status: "error",
      });
    }
  };
