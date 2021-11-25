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
    console.log('gettting app invite for', user_id);
    const invite = await this.appInviteService.get(user_id);
    console.log({ invite });

    return {
      invite,
    };
  }
}
