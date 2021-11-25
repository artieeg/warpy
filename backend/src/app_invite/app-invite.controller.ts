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
    console.log({ invite });

    return {
      invite,
    };
  }

  @MessagePattern('app-invite.update')
  async updateAppInvite({ user_id }) {
    await this.appInviteService.update(user_id);

    return { status: 'ok' };
  }
}
