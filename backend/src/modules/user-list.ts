import { Injectable, Controller, Module } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserListFetcherService } from 'lib';
import { FollowModule, UserBlockModule } from '.';
import { IUserListRequest, IUserListResponse, IUser } from '@warpy/lib';

@Injectable()
export class NjsUserListService extends UserListFetcherService {}

@Controller()
export class UserListController {
  constructor(private userListService: NjsUserListService) {}

  @MessagePattern('user.get-list')
  async onGetList({
    user,
    page,
    list,
  }: IUserListRequest): Promise<IUserListResponse> {
    let users: IUser[];

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
