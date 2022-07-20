import { Injectable, OnModuleInit, Controller, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { MessagePattern } from '@nestjs/microservices';
import { EVENT_INVITE_AVAILABLE } from '@warpy-be/utils';
import { NotificationService, NotificationStore } from 'lib';
import { PrismaModule } from './prisma';
import {
  IInvite,
  IReadNotifications,
  IGetReadNotifications,
  INotificationsPage,
  IGetUnreadNotifications,
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
  async onNewInvite(invite: IInvite) {
    await this.notificationService.createInviteNotification(invite);
  }

  @MessagePattern('notifications.read')
  async onNotificationsRead({ user }: IReadNotifications) {
    await this.notificationService.readAllNotifications(user);
  }

  @MessagePattern('notifications.get-read')
  async onGetReadNotifications({
    user,
    page,
  }: IGetReadNotifications): Promise<INotificationsPage> {
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
  }: IGetUnreadNotifications): Promise<INotificationsPage> {
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
