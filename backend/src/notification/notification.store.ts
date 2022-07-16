import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationStore } from 'lib/stores/notification';

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
