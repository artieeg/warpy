import { Global, Module } from '@nestjs/common';
import { NjsTimerService } from './timer.service';

@Module({
  imports: [],
  providers: [NjsTimerService],
  controllers: [],
  exports: [NjsTimerService],
})
@Global()
export class TimerModule {}
