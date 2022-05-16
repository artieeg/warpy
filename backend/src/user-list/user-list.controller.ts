import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IUser, IUserListRequest, IUserListResponse } from '@warpy/lib';
import { UserListService } from './user-list.service';

@Controller()
export class UserListController {
  constructor(private userListService: UserListService) {}

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
