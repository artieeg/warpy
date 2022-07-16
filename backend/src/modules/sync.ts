import { Injectable, Controller, Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { AppInviteModule } from './app-invite';
import { UserModule } from './user';
import { EVENT_USER_CONNECTED } from '@warpy-be/utils';
import { SyncService } from 'lib';
import { CategoryModule, FriendFeedModule, UserListModule } from '.';
import { IWhoAmIRequest, IWhoAmIResponse } from '@warpy/lib';

@Injectable()
export class NjsSyncService extends SyncService {}

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
