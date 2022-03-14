import { Injectable } from '@nestjs/common';
import { TimerService } from '@warpy-be/shared';
import { HostStore } from './host.store';

@Injectable()
export class HostService {
  constructor(
    private timerService: TimerService,
    private hostStore: HostStore,
  ) {}

  async reassignHost(host: string) {}

  /**
   * checks if user is a host and is disconnected
   * waits for 15 seconds, if user failed to reconnect, reassings host
   * */
  async tryReassignHostAfterTimeout(user: string) {
    const stream = await this.hostStore.getStreamByHost(user);

    //If user is not host
    if (!stream) {
      return;
    }

    this.timerService.setTimer(async () => {
      const isOnline = await this.hostStore.isHostOnline(user);

      //host has reconnected within 15 seconds, ignore
      if (!isOnline) {
        return;
      }

      //TODO: reassign host
    }, 15000);
  }
}
