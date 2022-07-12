import { Injectable, OnModuleInit } from '@nestjs/common';
import { NatsService } from 'lib/services';

@Injectable()
export class NjsNatsService extends NatsService implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.onInstanceInit();
  }
}
