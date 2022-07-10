import { ExceptionFilter } from '@warpy-be/rpc-exception.filter';
import { EVENT_USER_DISCONNECTED } from '@warpy-be/utils';
import { Controller, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  ICreateAnonUserResponse,
  INewUser,
  INewUserResponse,
  IUserDelete,
  IUserDeleteResponse,
  IUserDisconnected,
  IUserInfoResponse,
  IUserRequest,
  IUserSearchRequest,
  IUserSearchResponse,
  IUserUpdateRequest,
  IUserUpdateResponse,
} from '@warpy/lib';
import { UserService } from './user.service';

@Controller()
@UseFilters(ExceptionFilter)
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  @MessagePattern('user.get')
  async onUserRequest({ user, id }: IUserRequest): Promise<IUserInfoResponse> {
    console.log(user, id);
    const data = await this.userService.getUserInfo(id, user);

    return data;
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

  @MessagePattern('user.create.anon')
  async onAnonUserCreate(): Promise<ICreateAnonUserResponse> {
    return this.userService.createAnonUser();
  }

  @MessagePattern('user.create')
  async onUserCreate(data: INewUser): Promise<INewUserResponse> {
    if (!this.configService.get('isProduction') && data.kind === 'dev') {
      return this.userService.createUser(data);
    }
  }

  @MessagePattern('user.delete')
  async onUserDelete({ user }: IUserDelete): Promise<IUserDeleteResponse> {
    await this.userService.deleteUser(user);

    return {
      status: 'ok',
    };
  }

  @MessagePattern('user.search')
  async onUserSearch({
    textToSearch,
    user,
  }: IUserSearchRequest): Promise<IUserSearchResponse> {
    const users = await this.userService.search(textToSearch, user);

    return { users };
  }

  @MessagePattern('user.disconnected')
  async onUserDisconnect({ user }: IUserDisconnected) {
    const isAnonUser = user.slice(0, 9) === 'anon_user';

    if (isAnonUser) {
      await this.userService.deleteUser(user);
    }

    this.eventEmitter.emit(EVENT_USER_DISCONNECTED, { user });
  }
}
