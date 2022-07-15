import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StreamerIdStore } from 'lib/stores';

@Injectable()
export class NjsStreamerIdStore extends StreamerIdStore {
  constructor(configService: ConfigService) {
    super(configService.get('blockStreamerIdStoreAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
