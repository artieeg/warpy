import { Injectable, OnModuleDestroy } from '@nestjs/common';
import cuid from 'cuid';

type Timer = ReturnType<typeof setTimeout>;

@Injectable()
export class TimerService {
  private timers: Record<string, Timer>;

  //TODO: wait for all timers to finish when shutting down

  setTimer(cb: any, delay: number) {
    const id = cuid();

    this.timers[id] = setTimeout(async () => {
      console.log('timers before', this.timers);
      delete this.timers[id];
      await cb();
      console.log('timers after', this.timers);
    }, delay);
  }
}
