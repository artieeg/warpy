import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IFollowRequest,
  IFollowResponse,
  IUnfollowRequest,
  IUnfollowResponse,
} from '@warpy/lib';
import { NjsFollowService } from './follow.service';

@Controller()
export class FollowController {
  constructor(private followService: NjsFollowService) {}

  @MessagePattern('user.follow')
  async onUserFollow({
    user,
    userToFollow,
  }: IFollowRequest): Promise<IFollowResponse> {
    console.log('test');
    const { followed_id } = await this.followService.createNewFollow(
      user,
      userToFollow,
    );

    return { followedUser: followed_id };
  }

  @MessagePattern('user.unfollow')
  async onUserUnfollo({
    user,
    userToUnfollow,
  }: IUnfollowRequest): Promise<IUnfollowResponse> {
    await this.followService.deleteFollow(user, userToUnfollow);

    return {
      unfollowedUser: userToUnfollow,
    };
  }
}
