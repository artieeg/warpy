import { Injectable, Controller, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FollowService, FollowStore } from '@warpy-be/app';
import {
  IFollowRequest,
  IFollowResponse,
  IUnfollowRequest,
  IUnfollowResponse,
} from '@warpy/lib';
import { PrismaService, PrismaModule } from './prisma';
@Injectable()
export class NjsFollowStore extends FollowStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsFollowService extends FollowService {
  constructor(followStore: NjsFollowStore) {
    super(followStore);
  }
}

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

@Module({
  imports: [PrismaModule],
  providers: [NjsFollowStore, NjsFollowService],
  controllers: [FollowController],
  exports: [NjsFollowStore, NjsFollowService],
})
export class FollowModule {}
