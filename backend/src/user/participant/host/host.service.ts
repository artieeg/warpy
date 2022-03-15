import { Injectable } from '@nestjs/common';
import { TimerService } from '@warpy-be/shared';
import { IFullParticipant } from '../store';
import { HostStore } from './host.store';

@Injectable()
export class HostService {
  constructor(
    private timerService: TimerService,
    private hostStore: HostStore,
  ) {}

  async handlePossibleHost({ role, stream, id }: IFullParticipant) {
    //If user has been downgraded to viewer, remove him from the list
    if (role === 'viewer') {
      return this.hostStore.delPossibleHost(stream, id);
    }

    return this.hostStore.addPossibleHost(stream, id);
  }

  async reassignHost(host: string) {}

  /**
   * checks if user is a host and is disconnected
   * waits for 15 seconds, if user failed to reconnect, reassings host
   * */
  async tryReassignHostAfterTime(user: string) {
    const host = await this.hostStore.getHostInfo(user);

    //If user is not host
    if (!host || !host.stream || !host.online) {
      return;
    }

    //make user offline
    await this.hostStore.setStreamHostOnlineStatus(user, false);

    //wait 15 seconds and check if the host has reconnected
    this.timerService.setTimer(async () => {
      const isOnline = await this.hostStore.isHostOnline(user);

      //if the user has reconnected, don't do anything else
      if (!isOnline) {
        return;
      }

      //TODO: reassign host
    }, 15000);
  }
}
