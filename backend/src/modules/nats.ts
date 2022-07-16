import { Injectable, Module, OnModuleInit } from '@nestjs/common';
import { NatsService } from 'lib';

@Injectable()
export class NjsNatsService extends NatsService implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.onInstanceInit();
  }
}

@Module({
  providers: [NjsNatsService],
  exports: [NjsNatsService],
})
export class NatsModule {}
