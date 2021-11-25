import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IAppInviteRequest, IAppInviteResponse } from '@warpy/lib';
import { AppInviteService } from './app-invite.service';

@Controller()
export class AppInviteController {
  constructor(private appInviteService: AppInviteService) {}

  @MessagePattern('app-invite.get')
  async getAppInvite({
    user_id,
  }: IAppInviteRequest): Promise<IAppInviteResponse> {
    const invite = await this.appInviteService.get(user_id);

    return {
      invite,
    };
  }
}
