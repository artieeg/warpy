import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IUserOnlineStatusResponse, IUserStatusRequest } from '@warpy/lib';
import { UserOnlineStatusService } from './user-online-status.service';

@Controller()
export class UserOnlineStatusController {
  constructor(private userOnlineStatusService: UserOnlineStatusService) {}

  @MessagePattern('user-online-status.get')
  async onStatusRequest({
    user,
  }: IUserStatusRequest): Promise<IUserOnlineStatusResponse> {
    const online = await this.userOnlineStatusService.getUserOnlineStatus(user);

    return {
      user,
      online,
    };
  }
}
