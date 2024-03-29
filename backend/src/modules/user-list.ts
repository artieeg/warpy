import { Injectable, Controller, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserListFetcherService } from '@warpy-be/app';
import { RequestUserList, UserListResponse, User } from '@warpy/lib';
import { FollowModule, NjsFollowStore } from './follow';
import { NjsUserBlockService, UserBlockModule } from './user-block';

@Injectable()
export class NjsUserListService extends UserListFetcherService {
  constructor(followStore: NjsFollowStore, blockService: NjsUserBlockService) {
    super(followStore, blockService);
  }
}

@Controller()
export class UserListController {
  constructor(private userListService: NjsUserListService) {}

  @MessagePattern('user.get-list')
  async onGetList({
    user,
    page,
    list,
  }: RequestUserList): Promise<UserListResponse> {
    let users: User[];

    if (list === 'followers') {
      users = await this.userListService.getFollowers(user, page);
    } else if (list === 'following') {
      users = await this.userListService.getFollowing(user, page);
    } else {
      users = await this.userListService.getBlockedUsers(user, page);
    }

    return {
      list,
      users,
    };
  }
}

@Module({
  imports: [UserBlockModule, FollowModule],
  providers: [NjsUserListService],
  controllers: [UserListController],
  exports: [NjsUserListService],
})
export class UserListModule {}
