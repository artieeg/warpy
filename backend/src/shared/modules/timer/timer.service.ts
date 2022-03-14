import { Injectable } from '@nestjs/common';
import cuid from 'cuid';

type Timer = ReturnType<typeof setTimeout>;

@Injectable()
export class TimerService {
  timers: Record<string, Timer>;

  setTimer(cb: any, delay: number) {
    const id = cuid();

    this.timers[id] = setTimeout(() => {
      console.log('timers before', this.timers);
      delete this.timers[id];
      cb();
      console.log('timers after', this.timers);
    }, delay);
  }
}
