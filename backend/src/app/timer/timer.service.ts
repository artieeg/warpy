import cuid from 'cuid';

type Timer = ReturnType<typeof setTimeout>;

export class TimerService {
  private timers: Record<string, Timer>;

  constructor() {
    this.timers = {};
  }

  //TODO: wait for all timers to finish when shutting down

  setTimer(cb: any, delay: number) {
    const id = cuid();

    this.timers[id] = setTimeout(async () => {
      delete this.timers[id];
      await cb();
    }, delay);
  }
}
