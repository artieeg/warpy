import { FollowService } from "@backend/services/follow";
import { IFollowRequest, IFollowResponse, MessageHandler } from "@warpy/lib";

export const onFollow: MessageHandler<IFollowRequest, IFollowResponse> = async (
  data,
  respond
) => {
  const { user, userToFollow } = data;

  const follow = await FollowService.createNewFollow(user, userToFollow);

  respond({
    followedUser: follow.followed_id,
  });
};
