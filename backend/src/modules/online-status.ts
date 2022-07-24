import { Injectable, OnModuleInit, Controller, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { OnUserDisconnect, OnUserConnect } from '@warpy-be/interfaces';
import { EVENT_USER_CONNECTED, EVENT_USER_DISCONNECTED } from '@warpy-be/utils';
import { UserOnlineStatusStore } from '@warpy-be/app';
import { IUserStatusRequest, IUserOnlineStatusResponse } from '@warpy/lib';

@Injectable()
export class NjsUserOnlineStatusCache
  extends UserOnlineStatusStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('userOnlineStatusCache'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Injectable()
export class UserOnlineStatusService {
  constructor(private cache: NjsUserOnlineStatusCache) {}

  async setUserOnline(user: string) {
    await this.cache.setUserOnline(user);
  }

  async setUserOffline(user: string) {
    await this.cache.setUserOffline(user);
  }

  async getUserStatus(user: string): Promise<boolean> {
    return await this.cache.getUserStatus(user);
  }

  async getUserStatusMany(users: string[]): Promise<Record<string, boolean>> {
    const statuses = await this.cache.getUserStatusMany(users);

    const result = {};
    users.forEach((user, idx) => {
      result[user] = !!statuses[idx];
    });

    return result;
  }
}

@Controller()
export class UserOnlineStatusController
  implements OnUserDisconnect, OnUserConnect
{
  constructor(private userOnlineStatusService: UserOnlineStatusService) {}

  @OnEvent(EVENT_USER_CONNECTED)
  async onUserConnect({ user }) {
    await this.userOnlineStatusService.setUserOnline(user);
  }

  @OnEvent(EVENT_USER_DISCONNECTED)
  async onUserDisconnect({ user }) {
    await this.userOnlineStatusService.setUserOffline(user);
  }

  @MessagePattern('user-online-status.get')
  async onStatusRequest({
    user,
  }: IUserStatusRequest): Promise<IUserOnlineStatusResponse> {
    const online = await this.userOnlineStatusService.getUserStatus(user);

    return {
      user,
      online,
    };
  }
}

@Module({
  imports: [],
  providers: [NjsUserOnlineStatusCache, UserOnlineStatusService],
  controllers: [UserOnlineStatusController],
  exports: [UserOnlineStatusService],
})
export class UserOnlineStatusModule {}
