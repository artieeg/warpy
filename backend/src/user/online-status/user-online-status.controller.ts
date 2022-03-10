import { OnUserDisconnect, OnUserDisconnect } from '@backend_2/interfaces';
import {
  EVENT_USER_CONNECTED,
  EVENT_USER_DISCONNECTED,
} from '@backend_2/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { IUserOnlineStatusResponse, IUserStatusRequest } from '@warpy/lib';
import { UserOnlineStatusService } from './user-online-status.service';

@Controller()
export class UserOnlineStatusController implements OnUserDisconnect {
  constructor(private userOnlineStatusService: UserOnlineStatusService) {}

  @OnEvent(EVENT_USER_CONNECTED)
  async onUserConnect({ user }: { user: string }) {
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
