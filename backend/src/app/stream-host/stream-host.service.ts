import { EventEmitter2 } from '@nestjs/event-emitter';
import { HostReassignError } from '@warpy-be/errors';
import {
  EVENT_HOST_REASSIGN,
  EVENT_HOST_REASSIGN_FAILED,
  EVENT_NEW_PARTICIPANT,
} from '@warpy-be/utils';
import { Participant } from '@warpy/lib';
import { ParticipantStore } from '@warpy-be/app/participant';
import { UserStore } from '@warpy-be/app/user';
import { TimerService } from '../timer';
import { HostStore } from './stream-host.store';

//Hosts will have 20 seconds to rejoin and preserve their host role;
const HOST_REJOIN_PERIOD = 20000;

export class HostService {
  constructor(
    private timerService: TimerService,
    private hostStore: HostStore,
    private events: EventEmitter2,
    private user: UserStore,
    private participantStore: ParticipantStore,
  ) {}

  async getHostInfo(user: string) {
    return this.hostStore.getHostInfo(user);
  }

  async getStreamHostId(stream: string) {
    return this.hostStore.getHostId(stream);
  }

  /**
   * When hosts leave w/o assigning a new host,
   * they have {HOST_REJOIN_PERIOD} seconds to rejoin the stream
   * and preserve the host position
   *
   * This method marks the user to prevent the
   * loss of the host role
   * */
  async handleRejoinedUser(user: string) {
    const host = await this.hostStore.getHostInfo(user);

    if (!host) {
      return;
    }

    //Mark the user as joined to prevent the loss of the host role
    return this.hostStore.setHostJoinedStatus(user, true);
  }

  /**
   * update the store and emit event
   * */
  private async setStreamHost(stream: string, host: Participant) {
    await this.hostStore.setStreamHost(host);

    this.events.emit(EVENT_HOST_REASSIGN, {
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

    await Promise.all([
      //because previous host hasn't left the stream, they can be picked as a host again
      this.hostStore.addPossibleHost(currentHostData),

      //set new stream host
      this.setStreamHost(stream, nextHostData),
    ]);
  }

  /**
   * checks if a user is a host and is disconnected
   * reassigns the host after a few seconds, if the user hasn't rejoined
   * */
  async tryReassignHostAfterTime(user: string) {
    const stream = await this.hostStore.getHostedStreamId(user);

    //If user is not host
    if (!stream) {
      return this.hostStore.delPossibleHost(user, stream);
    }

    //make user offline
    await this.hostStore.setHostJoinedStatus(user, false);

    //wait a few seconds and check if the host has reconnected
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
        this.events.emit(EVENT_HOST_REASSIGN_FAILED, {
          stream: stream,
        });
      } else {
        await this.setStreamHost(stream, newHost);
      }
    }, HOST_REJOIN_PERIOD);
  }

  /**
   * Initializes the host data when a new stream starts
   * */
  async initStreamHost({ user, stream }: { user: string; stream: string }) {
    const streamer = await this.user.find(user);

    const host: Participant = {
      ...streamer,
      role: 'streamer',
      audioEnabled: true,
      videoEnabled: true,
      isBanned: false,
      stream,
      isBot: false,
    };

    await Promise.all([
      this.participantStore.add(host),
      this.hostStore.setStreamHost(host),
    ]);

    this.events.emit(EVENT_NEW_PARTICIPANT, { participant: host });
  }
}
