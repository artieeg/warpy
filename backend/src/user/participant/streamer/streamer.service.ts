import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '@warpy-be/user/user.entity';
import { EVENT_NEW_PARTICIPANT } from '@warpy-be/utils';
import { IFullParticipant, ParticipantStore } from '../store';

@Injectable()
export class StreamerService {
  constructor(
    private userEntity: UserEntity,
    private store: ParticipantStore,
    private eventEmitter: EventEmitter2,
  ) {}

  async createNewStreamer({
    user,
    stream,
    sendNodeId,
    recvNodeId,
  }: {
    user: string;
    stream: string;
    sendNodeId: string;
    recvNodeId: string;
  }) {
    const streamer = await this.userEntity.findById(user);

    const host: IFullParticipant = {
      ...streamer,
      role: 'streamer',
      recvNodeId,
      sendNodeId,
      audioEnabled: true,
      videoEnabled: true,
      isBanned: false,
      stream,
      isBot: false,
    };

    await this.store.add(host);

    this.eventEmitter.emit(EVENT_NEW_PARTICIPANT, { participant: host });
  }
}
