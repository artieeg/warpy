import { Controller, Injectable, Module, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { ExceptionFilter } from '@warpy-be/rpc-exception.filter';
import { EVENT_USER_DISCONNECTED } from '@warpy-be/utils';
import {
  RequestUpdateUser,
  UserUpdateResponse,
  CreateAnonUserResponse,
  RequestCreateUser,
  NewUserResponse,
  RequestDeleteUser,
  UserDeleteResponse,
  RequestUserSearch,
  UserSearchResponse,
  IUserDisconnected,
} from '@warpy/lib';
import { UserStore, UserService } from '@warpy-be/app';
import { AppInviteModule } from './app-invite';
import { DeveloperAccountModule } from './developer-account';
import { FollowModule } from './follow';
import { PrismaModule, PrismaService } from './prisma';
import { NjsRefreshTokenStore, NJTokenService, TokenModule } from './token';

@Injectable()
export class NjsUserStore extends UserStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsUserService extends UserService {
  constructor(
    userStore: NjsUserStore,
    tokenService: NJTokenService,
    refreshTokenStore: NjsRefreshTokenStore,
    events: EventEmitter2,
  ) {
    super(userStore, tokenService, refreshTokenStore, events);
  }
}

@Controller()
@UseFilters(ExceptionFilter)
export class UserController {
  constructor(
    private userService: NjsUserService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  @MessagePattern('user.update')
  async onUserUpdate({
    user,
    data,
  }: RequestUpdateUser): Promise<UserUpdateResponse> {
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
  async onAnonUserCreate(): Promise<CreateAnonUserResponse> {
    return this.userService.createAnonUser();
  }

  @MessagePattern('user.create')
  async onUserCreate(data: RequestCreateUser): Promise<NewUserResponse> {
    if (!this.configService.get('isProduction') && data.kind === 'dev') {
      return this.userService.createUser(data);
    }
  }

  @MessagePattern('user.delete')
  async onUserDelete({ user }: RequestDeleteUser): Promise<UserDeleteResponse> {
    await this.userService.del(user);

    return {
      status: 'ok',
    };
  }

  @MessagePattern('user.search')
  async onUserSearch({
    textToSearch,
    user,
  }: RequestUserSearch): Promise<UserSearchResponse> {
    const users = await this.userService.search(textToSearch, user);

    return { users };
  }

  @MessagePattern('user.disconnected')
  async onUserDisconnect({ user }: IUserDisconnected) {
    const isAnonUser = user.slice(0, 9) === 'anon_user';

    if (isAnonUser) {
      await this.userService.del(user);
    }

    this.eventEmitter.emit(EVENT_USER_DISCONNECTED, { user });
  }
}

@Module({
  imports: [
    PrismaModule,
    FollowModule,
    TokenModule,
    AppInviteModule,
    DeveloperAccountModule,
  ],
  controllers: [UserController],
  providers: [NjsUserStore, NjsUserService],
  exports: [NjsUserStore, NjsUserService],
})
export class UserModule {}
