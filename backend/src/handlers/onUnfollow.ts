import { FollowService } from "@backend/services/follow";
import {
  IUnfollowRequest,
  IUnfollowResponse,
  MessageHandler,
} from "@warpy/lib";

export const onUnfollow: MessageHandler<IUnfollowRequest, IUnfollowResponse> =
  async (data, respond) => {
    const { user, userToUnfollow } = data;

    await FollowService.deleteFollow(user, userToUnfollow);

    respond({
      unfollowedUser: userToUnfollow,
    });
  };
