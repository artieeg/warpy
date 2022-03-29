import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HostReassignError, StreamNotFound } from '@warpy-be/errors';
import { TimerService } from '@warpy-be/shared';
import {
  EVENT_HOST_REASSIGN,
  EVENT_HOST_REASSIGN_FAILED,
} from '@warpy-be/utils';
import { IParticipant } from '@warpy/lib';
import { IFullParticipant } from '../store';
import { HostStore } from './host.store';

@Injectable()
export class HostService {
  constructor(
    private timerService: TimerService,
    private hostStore: HostStore,
    private eventEmitter: EventEmitter2,
  ) {}

  async getHostInfo(user: string) {
    return this.hostStore.getHostInfo(user);
  }

  async getStreamHostId(stream: string) {
    return this.hostStore.getHostId(stream);
  }

  async handlePossibleHost(participant: IFullParticipant) {
    const { role, id, stream } = participant;

    //If user has been downgraded to viewer, remove him from the list
    if (role === 'viewer') {
      return this.hostStore.delPossibleHost(id, stream);
    }

    return this.hostStore.addPossibleHost(participant);
  }

  async handleRejoinedUser(user: string) {
    const host = await this.hostStore.getHostInfo(user);

    if (!host) {
      return;
    }

    return this.hostStore.setHostJoinedStatus(user, true);
  }

  /**
   * update the store and emit event
   * */
  private async setStreamHost(stream: string, host: IParticipant) {
    await this.hostStore.setStreamHost(host);
    this.eventEmitter.emit(EVENT_HOST_REASSIGN, {
      stream,
      host,
    });
  }

  /**
   * Checks permissions and moves host role from one user to another
   * */
  async reassignHost(current: string, next: string) {
    const [stream, nextHostData, currentHostData] = await Promise.all([
      this.hostStore.getHostedStreamId(current),
      this.hostStore.getHostInfo(next),
      this.hostStore.getHostInfo(current),
    ]);

    //checks
    if (
      (!stream || !nextHostData || !currentHostData) &&
      stream === nextHostData.stream
    ) {
      throw new HostReassignError();
    }

    return Promise.all([
      //because previous host hasn't left the stream, they can be picked as a host again
      this.hostStore.addPossibleHost(currentHostData),

      //set new stream host
      this.setStreamHost(stream, nextHostData),
    ]);
  }

  /**
   * checks if user is a host and is disconnected
   * waits for 15 seconds, if user failed to reconnect, reassings host
   * */
  async tryReassignHostAfterTime(user: string) {
    const stream = await this.hostStore.getHostedStreamId(user);

    //If user is not host
    if (!stream) {
      return this.hostStore.delPossibleHost(user, stream);
    }

    //make user offline
    await this.hostStore.setHostJoinedStatus(user, false);

    //wait 15 seconds and check if the host has reconnected
    this.timerService.setTimer(async () => {
      const hostHasRejoined = await this.hostStore.isHostJoined(user);

      //if the user has rejoined, don't do anything else
      if (hostHasRejoined) {
        return;
      }

      //fetch new host suggestion & delete previous host record
      const [newHost] = await Promise.all([
        this.hostStore.getRandomPossibleHost(stream),
        this.hostStore.delByStream(stream),
      ]);

      if (!newHost) {
        this.eventEmitter.emit(EVENT_HOST_REASSIGN_FAILED, {
          stream: stream,
        });
      } else {
        await this.setStreamHost(stream, newHost);
      }
    }, 1000); //TODO: debug
  }
}
