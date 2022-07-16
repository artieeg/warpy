import { Injectable, OnModuleInit, Controller, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import IORedis from 'ioredis';
import { StreamNodeAssignerStore } from 'lib';

@Injectable()
export class StreamNodeAssignerService
  extends StreamNodeAssignerStore
  implements OnModuleInit
{
  client: IORedis.Redis;

  constructor(configService: ConfigService) {
    super(configService.get('mediaStreamNodeAssigner'));
  }

  onModuleInit() {
    this.onInstanceInit();
  }
}

@Controller()
export class StreamNodeAssignerController {
  constructor(private streamNodeAssignerService: StreamNodeAssignerService) {}

  @OnEvent('stream.stopped')
  async onStreamStop({ stream }: { stream: string }) {
    await this.streamNodeAssignerService.del(stream);
  }
}

@Module({
  imports: [],
  providers: [StreamNodeAssignerService],
  controllers: [StreamNodeAssignerController],
  exports: [StreamNodeAssignerService],
})
export class StreamNodeAssignerModule {}
