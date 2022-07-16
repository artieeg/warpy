import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserOnlineStatusStore } from 'lib';

@Injectable()
export class NjsUserOnlineStatusCache
  extends UserOnlineStatusStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('userOnlineStatusCache'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
