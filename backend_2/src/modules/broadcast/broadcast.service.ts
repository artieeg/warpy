import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IParticipant } from '@warpy/lib';
import { NatsService } from '../nats/nats.service';
import { ParticipantService } from '../participant/participant.service';

@Injectable()
export class BroadcastService {
  constructor(
    private participant: ParticipantService,
    private nc: NatsService,
  ) {}

  private send(user: string, message: Uint8Array) {
    this.nc.publish(`reply.user.${user}`, message);
  }

  @OnEvent('participant.new')
  async broadcastNewParticipant(participant: IParticipant) {
    const ids = await this.participant.getStreamParticipants(
      participant.stream,
    );

    const message = this.nc.jc.encode({
      event: 'new-viewer',
      data: {
        stream: participant.stream,
        viewer: participant,
      },
    });

    ids.forEach((id) => this.send(id, message));
  }
}
