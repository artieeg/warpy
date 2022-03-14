import { Global, Module } from '@nestjs/common';
import { TimerService } from './timer.service';

@Module({
  imports: [],
  providers: [TimerService],
  controllers: [],
  exports: [TimerService],
})
@Global()
export class TimerModule {}
