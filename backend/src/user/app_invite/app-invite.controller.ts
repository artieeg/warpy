import { OnNewUser } from '@warpy-be/interfaces';
import { EVENT_USER_CREATED } from '@warpy-be/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import {
  IAppInviteRequest,
  IAppInviteResponse,
  IInviteApplyRequest,
} from '@warpy/lib';
import { AppInviteService } from './app-invite.service';

@Controller()
export class AppInviteController implements OnNewUser {
  constructor(private appInviteService: AppInviteService) {}

  @MessagePattern('app-invite.apply')
  async applyAppInvite({
    user,
    code,
  }: IInviteApplyRequest): Promise<{ status: string }> {
    return await this.appInviteService.accept(user, code);
  }

  @MessagePattern('app-invite.get.by-id')
  async getAppInviteById({ id }: { id: string }): Promise<IAppInviteResponse> {
    const invite = await this.appInviteService.getById(id);

    return {
      invite,
    };
  }

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
  async updateAppInvite({ user }) {
    const invite = await this.appInviteService.update(user);

    return { invite };
  }

  @OnEvent(EVENT_USER_CREATED)
  async onNewUser({ user }) {
    this.appInviteService.createAppInvite(user);
  }
}
