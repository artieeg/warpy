import { ExceptionFilter } from '@backend_2/rpc-exception.filter';
import { EVENT_USER_DISCONNECTED } from '@backend_2/utils';
import { Controller, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  ICreateAnonUserResponse,
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
import { UserOnlineStatusService } from './online-status/user-online-status.service';
import { ParticipantCommonService } from './participant/common/participant-common.service';
import { UserService } from './user.service';

@Controller()
@UseFilters(ExceptionFilter)
export class UserController {
  constructor(
    private userService: UserService,
    private participantService: ParticipantCommonService,
    private userOnlineStatusService: UserOnlineStatusService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  @MessagePattern('user.get')
  async onUserRequest({ user, id }: IUserRequest): Promise<IUserInfoResponse> {
    console.log(user, id);
    const data = await this.userService.getUserInfo(id, user);

    return data;
  }

  @MessagePattern('user.whoami-request')
  async onUserGet({ user }: IWhoAmIRequest): Promise<IWhoAmIResponse> {
    const data = await this.userService.getById(user);
    await this.userOnlineStatusService.setUserOnline(user);

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
      return this.userService.createDevUser(data);
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
  }: IUserSearchRequest): Promise<IUserSearchResponse> {
    const users = await this.userService.search(textToSearch);

    return { users };
  }

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

    const isBot = user.slice(0, 3) === 'bot';

    if (isBot) {
      await this.participantService.deleteBotParticipant(user);
    } else {
      await this.participantService.deleteParticipant(user);
    }

    await this.userOnlineStatusService.setUserOffline(user);

    this.eventEmitter.emit(EVENT_USER_DISCONNECTED, { user });
  }
}
