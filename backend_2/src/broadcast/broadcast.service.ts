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

  @OnEvent('participant.kicked')
  async broadcastKickedParticipant(participant: IParticipant) {
    const { stream, id } = participant;

    const ids = await this.participant.getStreamParticipants(stream);

    const payload = this.messageService.encodeMessage({
      event: 'user-kicked',
      data: {
        user: id,
      },
    });

    this.broadcast(ids, payload);
  }

  @OnEvent('chat.message')
  async broadcastChatMessage({ idsToBroadcast, message }: any) {
    const payload = this.messageService.encodeMessage({
      event: 'chat-message',
      data: {
        message,
      },
    });

    this.broadcast(idsToBroadcast, payload);
  }

  @OnEvent('reactions')
  async broadcastReactions({ stream, reactions }: any) {
    const ids = await this.participant.getStreamParticipants(stream);

    const message = this.messageService.encodeMessage({
      event: 'reactions-update',
      data: {
        stream,
        reactions,
      },
    });

    this.broadcast(ids, message);
  }

  @OnEvent('participant.active-speakers')
  async broadcastActiveSpeakers({
    stream,
    activeSpeakers,
  }: {
    stream: string;
    activeSpeakers: any[];
  }) {
    const ids = await this.participant.getStreamParticipants(stream);

    activeSpeakers.forEach((speaker) => {
      const message = this.messageService.encodeMessage({
        event: 'active-speaker',
        data: {
          stream: stream,
          speaker,
        },
      });

      this.broadcast(ids, message);
    });
  }

  @OnEvent('participant.new-speaker')
  async broadcastNewSpeaker(speaker: IParticipant) {
    const { stream } = speaker;
    const ids = await this.participant.getStreamParticipants(stream);

    const message = this.messageService.encodeMessage({
      event: 'new-speaker',
      data: {
        speaker,
        stream,
      },
    });

    this.broadcast(ids, message);
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
