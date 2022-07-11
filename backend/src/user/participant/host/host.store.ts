import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HostStoreImpl } from 'lib/stores/host';

@Injectable()
export class HostStore extends HostStoreImpl {
  constructor(configService: ConfigService) {
    super(configService.get('streamHostAddr'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}
