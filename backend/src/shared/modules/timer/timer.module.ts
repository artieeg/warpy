import { Global, Injectable, Module } from '@nestjs/common';
import { TimerService } from '@warpy-be/app';

@Injectable()
export class NjsTimerService extends TimerService {}

@Module({
  imports: [],
  providers: [NjsTimerService],
  controllers: [],
  exports: [NjsTimerService],
})
@Global()
export class TimerModule {}
