import { Injectable, OnModuleInit, Controller, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { EVENT_INVITE_AVAILABLE } from '@warpy-be/utils';
import { NotificationService, NotificationStore } from '@warpy-be/app';
import { PrismaModule } from './prisma';
import {
  Invite,
  RequestReadNotifications,
  RequestFetchReadNotifications,
  NotificationsPage,
  RequestFetchUnreadNotifications,
} from '@warpy/lib';
import { NjsMessageService } from './message';

@Injectable()
export class NjsNotificationStore
  extends NotificationStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('notificationStoreAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Injectable()
export class NjsNotificationService extends NotificationService {
  constructor(
    notificationStore: NjsNotificationStore,
    messageService: NjsMessageService,
  ) {
    super(notificationStore, messageService);
  }
}

@Controller()
export class NotificationController {
  constructor(private notificationService: NjsNotificationService) {}

  @OnEvent(EVENT_INVITE_AVAILABLE)
  async onNewInvite(invite: Invite) {
    await this.notificationService.createInviteNotification(invite);
  }

  @MessagePattern('notifications.read')
  async onNotificationsRead({ user }: RequestReadNotifications) {
    await this.notificationService.readAllNotifications(user);
  }

  @MessagePattern('notifications.get-read')
  async onGetReadNotifications({
    user,
    page,
  }: RequestFetchReadNotifications): Promise<NotificationsPage> {
    const notifications = await this.notificationService.getReadNotifications(
      user,
      page,
    );

    return {
      notifications,
    };
  }

  @MessagePattern('notifications.get-unread')
  async onGetUnreadNotifications({
    user,
  }: RequestFetchUnreadNotifications): Promise<NotificationsPage> {
    const notifications = await this.notificationService.getUnreadNotifications(
      user,
    );

    return {
      notifications,
    };
  }
}

@Module({
  imports: [PrismaModule],
  providers: [NjsNotificationStore, NjsNotificationService],
  controllers: [NotificationController],
  exports: [],
})
export class NotificationModule {}
