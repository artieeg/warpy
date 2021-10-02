import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ParticipantEntity } from './participant.entity';

type NewViewerParams = { user: string; stream: string; recvNodeId: string };

@Injectable()
export class ParticipantService {
  constructor(
    private participant: ParticipantEntity,
    private eventEmitter: EventEmitter2,
  ) {}

  async getStreamParticipants(stream: string) {
    return this.participant.getIdsByStream(stream);
  }

  async createNewViewer({ user, stream, recvNodeId }: NewViewerParams) {
    const participant = await this.participant.create({
      user_id: user,
      stream,
      role: 'viewer',
      recvNodeId,
    });

    this.eventEmitter.emit('participant.new', participant);
  }
}
