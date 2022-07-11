import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HostStore } from 'lib/stores/host';

@Injectable()
export class NjsHostStore extends HostStore {
  constructor(configService: ConfigService) {
    super(configService.get('streamHostAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
