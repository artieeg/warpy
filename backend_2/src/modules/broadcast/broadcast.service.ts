import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IParticipant } from '@warpy/lib';
import { connect, JSONCodec, NatsConnection } from 'nats';
import { ParticipantService } from '../participant/participant.service';

@Injectable()
export class BroadcastService implements OnModuleInit {
  nc: NatsConnection;
  jc = JSONCodec();

  constructor(private participant: ParticipantService) {}

  async onModuleInit() {
    this.nc = await connect({
      servers: [process.env.NATS_ADDR],
    });
  }

  private send(user: string, message: Uint8Array) {
    this.nc.publish(`reply.user.${user}`, message);
  }

  @OnEvent('participant.new')
  async broadcastNewParticipant(participant: IParticipant) {
    const ids = await this.participant.getStreamParticipants(
      participant.stream,
    );

    const message = this.jc.encode({
      event: 'new-viewer',
      data: {
        stream: participant.stream,
        viewer: participant,
      },
    });

    ids.forEach((id) => this.send(id, message));
  }
}
