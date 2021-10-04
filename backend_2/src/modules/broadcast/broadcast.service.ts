import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IParticipant } from '@warpy/lib';
import { MessageService } from '../message/message.service';
import { ParticipantService } from '../participant/participant.service';

@Injectable()
export class BroadcastService {
  constructor(
    private participant: ParticipantService,
    private messageService: MessageService,
  ) {}

  private broadcast(ids: string[], message: Uint8Array) {
    ids.forEach((id) => this.messageService.send(id, message));
  }

  @OnEvent('participant.raise-hand')
  async broadcastHandRaise(viewer: IParticipant) {
    const { stream } = viewer;
    const ids = await this.participant.getStreamParticipants(stream);

    const message = this.messageService.encodeMessage({
      event: 'raise-hand',
      data: {
        viewer,
        stream,
      },
    });

    this.broadcast(ids, message);
  }

  @OnEvent('participant.delete')
  async broadcastParticipantLeft({
    user,
    stream,
  }: {
    user: string;
    stream: string;
  }) {
    const ids = await this.participant.getStreamParticipants(stream);

    const message = this.messageService.encodeMessage({
      event: 'user-left',
      data: {
        user,
        stream,
      },
    });

    this.broadcast(ids, message);
  }

  @OnEvent('participant.new')
  async broadcastNewParticipant(participant: IParticipant) {
    const ids = await this.participant.getStreamParticipants(
      participant.stream,
    );

    const message = this.messageService.encodeMessage({
      event: 'new-viewer',
      data: {
        stream: participant.stream,
        viewer: participant,
      },
    });

    this.broadcast(ids, message);
  }
}
