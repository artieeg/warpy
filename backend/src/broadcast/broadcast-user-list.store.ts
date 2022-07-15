import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BroadcastUserListStore } from 'lib/stores';

@Injectable()
export class NjsBroadcastUserListStore
  extends BroadcastUserListStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('broadcastUserListStoreAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
