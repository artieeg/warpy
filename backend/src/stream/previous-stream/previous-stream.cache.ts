import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PreviousStreamStore } from 'lib';

@Injectable()
export class NjsPreviousStreamStore
  extends PreviousStreamStore
  implements OnModuleInit
{
  constructor(configService: ConfigService) {
    super(configService.get('previousStreamCacheAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
