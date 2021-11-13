import { ExceptionFilter } from '@backend_2/rpc-exception.filter';
import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  INewUser,
  INewUserResponse,
  IUserDelete,
  IUserDeleteResponse,
  IUserInfoResponse,
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
    const data = await this.userService.getUserInfo(id, user);

    return data;
  }

  @UseFilters(ExceptionFilter)
  @MessagePattern('user.whoami-request')
  async onUserGet({ user }: IWhoAmIRequest): Promise<IWhoAmIResponse> {
    const data = await this.userService.getById(user);

    return {
      user: data,
      following: [],
    };
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
}
