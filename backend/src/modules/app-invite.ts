import { Controller, Injectable, Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { OnNewUser } from '@warpy-be/interfaces';
import { EVENT_USER_CREATED } from '@warpy-be/utils';
import { AppliedAppInviteStore, AppInviteService, AppInviteStore } from '@warpy-be/app';
import {
  IInviteApplyRequest,
  IAppInviteResponse,
  IAppInviteRequest,
} from '@warpy/lib';
import { PrismaService, PrismaModule } from './prisma';

@Injectable()
export class NjsAppliedAppInviteStore extends AppliedAppInviteStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsAppInviteStore extends AppInviteStore {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
}

@Injectable()
export class NjsAppInviteService extends AppInviteService {
  constructor(
    appInviteStore: NjsAppInviteStore,
    appliedAppInviteStore: NjsAppliedAppInviteStore,
  ) {
    super(appInviteStore, appliedAppInviteStore);
  }
}

@Controller()
export class AppInviteController implements OnNewUser {
  constructor(private appInviteService: NjsAppInviteService) {}

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

@Module({
  imports: [PrismaModule],
  providers: [NjsAppInviteStore, NjsAppliedAppInviteStore, NjsAppInviteService],
  controllers: [AppInviteController],
  exports: [NjsAppInviteStore, NjsAppliedAppInviteStore],
})
export class AppInviteModule {}
