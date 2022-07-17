import { Injectable, Controller, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { AppInviteModule, NjsAppliedAppInviteStore } from './app-invite';
import { NjsUserService, UserModule } from './user';
import { EVENT_USER_CONNECTED } from '@warpy-be/utils';
import { SyncService } from 'lib';
import { IWhoAmIRequest, IWhoAmIResponse } from '@warpy/lib';
import { CategoryModule, NjsCategoryStore } from './category';
import { FriendFeedModule, NjsFriendFeedService } from './friend-feed';
import { NjsUserListService, UserListModule } from './user-list';

@Injectable()
export class NjsSyncService extends SyncService {
  constructor(
    userService: NjsUserService,
    appliedAppInviteStore: NjsAppliedAppInviteStore,
    categoryStore: NjsCategoryStore,
    friendFeedService: NjsFriendFeedService,
    userListService: NjsUserListService,
  ) {
    super(
      userService,
      appliedAppInviteStore,
      categoryStore,
      friendFeedService,
      userListService,
    );
  }
}

@Controller()
export class SyncController {
  constructor(
    private syncService: NjsSyncService,
    private eventEmitter: EventEmitter2,
  ) {}

  @MessagePattern('user.whoami-request')
  async onUserGet({ user }: IWhoAmIRequest): Promise<IWhoAmIResponse> {
    const data = await this.syncService.sync(user);

    this.eventEmitter.emit(EVENT_USER_CONNECTED, { user });

    return data;
  }
}

@Module({
  imports: [
    UserModule,
    UserListModule,
    AppInviteModule,
    CategoryModule,
    FriendFeedModule,
  ],
  providers: [NjsSyncService],
  controllers: [SyncController],
  exports: [],
})
export class SyncModule {}
