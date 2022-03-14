import { Injectable } from '@nestjs/common';
import { TimerService } from '@warpy-be/shared';

@Injectable()
export class HostService {
  constructor(private timerService: TimerService) {}

  /**
   * checks if user is a host and is disconnected
   * waits for 15 seconds, if user failed to reconnect, reassings host
   * */
  async tryReassignHostAfterTimeout(user: string) {}
}
