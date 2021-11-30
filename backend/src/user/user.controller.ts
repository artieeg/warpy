import { ExceptionFilter } from '@backend_2/rpc-exception.filter';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  INewUser,
  INewUserResponse,
  IUser,
  IUserDelete,
  IUserDeleteResponse,
  IUserDisconnected,
  IUserInfoResponse,
  IUserListRequest,
  IUserListResponse,
  IUserRequest,
  IUserSearchRequest,
  IUserSearchResponse,
  IUserUpdateRequest,
  IUserUpdateResponse,
  IWhoAmIRequest,
  IWhoAmIResponse,
} from '@warpy/lib';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @UseFilters(ExceptionFilter)
  @MessagePattern('user.get')
  async onUserRequest({ user, id }: IUserRequest): Promise<IUserInfoResponse> {
    console.log(user, id);
    const data = await this.userService.getUserInfo(id, user);

    return data;
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('user.whoami-request')
  async onUserGet({ user: userId }: IWhoAmIRequest): Promise<IWhoAmIResponse> {
    return this.userService.getById(userId);
  }

  @MessagePattern('user.update')
  async onUserUpdate({
    user,
    data,
  }: IUserUpdateRequest): Promise<IUserUpdateResponse> {
    try {
      await this.userService.update(user, data);

      return {
        status: 'ok',
      };
    } catch (e) {
      return {
        status: 'error',
        message: "we can't use this value",
      };
    }
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('user.create.anonymous')
  async onAnonUserCreate(): Promise<INewUserResponse> {
    return this.userService.createAnonUser();
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('user.create')
  async onUserCreate(data: INewUser): Promise<INewUserResponse> {
    if (process.env.NODE !== 'production' && data.kind === 'dev') {
      return this.userService.createDevUser(data);
    }
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('user.delete')
  async onUserDelete({ user }: IUserDelete): Promise<IUserDeleteResponse> {
    await this.userService.deleteUser(user);

    return {
      status: 'ok',
    };
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('user.search')
  async onUserSearch({
    textToSearch,
  }: IUserSearchRequest): Promise<IUserSearchResponse> {
    const users = await this.userService.search(textToSearch);

    return { users };
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('user.get-list')
  async onGetList({
    user,
    page,
    list,
  }: IUserListRequest): Promise<IUserListResponse> {
    let users: IUser[];

    if (list === 'followers') {
      users = await this.userService.getFollowers(user, page);
    } else if (list === 'following') {
      users = await this.userService.getFollowing(user, page);
    } else {
      users = await this.userService.getBlockedUsers(user, page);
    }

    return {
      list,
      users,
    };
  }

  @MessagePattern('user.disconnected')
  async onUserDisconnect({ user }: IUserDisconnected) {
    const isAnonUser = user.slice(0, 9) === 'anon_user';

    if (isAnonUser) {
      await this.userService.deleteUser(user);
    }
  }
}
