import { Global, Injectable, Module } from '@nestjs/common';
import { BroadcastService } from '@warpy-be/app';
import { NjsMessageService } from './message';

@Injectable()
export class NjsBroadcastService extends BroadcastService {
  constructor(messageService: NjsMessageService) {
    super(messageService);
  }
}

@Module({
  imports: [],
  controllers: [],
  providers: [NjsBroadcastService],
  exports: [NjsBroadcastService],
})
@Global()
export class BroadcastModule {}
