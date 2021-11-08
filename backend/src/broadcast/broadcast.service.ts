import { ParticipantEntity } from '@backend_2/participant/participant.entity';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IParticipant } from '@warpy/lib';
import { MessageService } from '../message/message.service';

@Injectable()
export class BroadcastService {
  constructor(
    private participant: ParticipantEntity,
    private messageService: MessageService,
  ) {}

  private broadcast(ids: string[], message: Uint8Array) {
    ids.forEach((id) => this.messageService.send(id, message));
  }

  @OnEvent('participant.media-toggle')
  async broadcastMediaToggle({
    user,
    stream,
    videoEnabled,
    audioEnabled,
  }: {
    user: string;
    stream: string;
    videoEnabled?: boolean;
    audioEnabled?: boolean;
  }) {
    const ids = await this.participant.getIdsByStream(stream);

    const payload = this.messageService.encodeMessage({
      event: 'user-toggled-media',
      data: {
        user,
        stream,
        videoEnabled,
        audioEnabled,
      },
    });

    this.broadcast(ids, payload);
  }

  @OnEvent('participant.kicked')
  async broadcastKickedParticipant(participant: IParticipant) {
    const { stream, id } = participant;

    const ids = await this.participant.getIdsByStream(stream);

    const payload = this.messageService.encodeMessage({
      event: 'user-kicked',
      data: {
        user: id,
        stream,
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
    const ids = await this.participant.getIdsByStream(stream);

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
    activeSpeakers: { user: string; volume: number }[];
  }) {
    const ids = await this.participant.getIdsByStream(stream);

    const message = this.messageService.encodeMessage({
      event: 'active-speaker',
      data: {
        stream: stream,
        speakers: activeSpeakers,
      },
    });

    this.broadcast(ids, message);
  }

  @OnEvent('participant.role-change')
  async broadcastRoleChange(user: IParticipant) {
    const ids = await this.participant.getIdsByStream(user.stream);

    const message = this.messageService.encodeMessage({
      event: 'participant-role-change',
      data: {
        user,
      },
    });

    this.broadcast(ids, message);
  }

  @OnEvent('participant.raise-hand')
  async broadcastHandRaise(viewer: IParticipant) {
    const { stream } = viewer;
    const ids = await this.participant.getIdsByStream(stream);

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
    const ids = await this.participant.getIdsByStream(stream);

    const message = this.messageService.encodeMessage({
      event: 'user-left',
      data: {
        user,
        stream,
      },
    });

    this.broadcast(ids, message);
  }

  @OnEvent('participant.new', { async: true })
  async broadcastNewParticipant(participant: IParticipant) {
    console.log('new participant', participant.id);
    const ids = await this.participant.getIdsByStream(participant.stream);

    const message = this.messageService.encodeMessage({
      event: 'new-participant',
      data: {
        stream: participant.stream,
        participant: participant,
      },
    });

    this.broadcast(ids, message);
  }
}
