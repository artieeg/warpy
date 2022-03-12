import { ParticipantStore } from '@backend_2/user/participant/store';
import { Injectable } from '@nestjs/common';
import { IParticipant } from '@warpy/lib';
import { MessageService } from '../message/message.service';
import { BroadcastUserListStore } from './broadcast-user-list.store';
import {
  ActiveSpeakersEvent,
  AwardSentEvent,
  ChatMessageEvent,
  MediaToggleEvent,
  ParticipantLeaveEvent,
  ReactionsEvent,
} from './types';

@Injectable()
export class BroadcastService {
  constructor(
    private participant: ParticipantStore,
    private messageService: MessageService,
    private broadcastUserListStore: BroadcastUserListStore,
  ) {}

  private broadcast(ids: string[], message: Uint8Array) {
    ids.forEach((id) => this.messageService.send(id, message));
  }

  async broadcastMediaToggle({
    user,
    stream,
    videoEnabled,
    audioEnabled,
  }: MediaToggleEvent) {
    const ids = await this.broadcastUserListStore.get(stream);

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

  async broadcastKickedParticipant(participant: IParticipant) {
    const { stream, id } = participant;

    const ids = await this.broadcastUserListStore.get(stream);

    const payload = this.messageService.encodeMessage({
      event: 'user-kicked',
      data: {
        user: id,
        stream,
      },
    });

    this.broadcast(ids, payload);
  }

  async broadcastChatMessage({ idsToBroadcast, message }: ChatMessageEvent) {
    const payload = this.messageService.encodeMessage({
      event: 'chat-message',
      data: {
        message,
      },
    });

    this.broadcast(idsToBroadcast, payload);
  }

  async broadcastReactions({ stream, reactions }: ReactionsEvent) {
    const ids = await this.broadcastUserListStore.get(stream);

    const message = this.messageService.encodeMessage({
      event: 'reactions-update',
      data: {
        stream,
        reactions,
      },
    });

    this.broadcast(ids, message);
  }

  async broadcastActiveSpeakers({
    stream,
    activeSpeakers,
  }: ActiveSpeakersEvent) {
    const ids = await this.broadcastUserListStore.get(stream);

    const message = this.messageService.encodeMessage({
      event: 'active-speaker',
      data: {
        stream: stream,
        speakers: activeSpeakers,
      },
    });

    this.broadcast(ids, message);
  }

  async broadcastRoleChange(user: IParticipant) {
    const ids = await this.broadcastUserListStore.get(user.stream);

    const message = this.messageService.encodeMessage({
      event: 'participant-role-change',
      data: {
        user,
      },
    });

    this.broadcast(ids, message);
  }

  async broadcastHandRaise(viewer: IParticipant) {
    const { stream } = viewer;

    const ids = await this.broadcastUserListStore.get(stream);
    console.log({ stream, ids });

    const message = this.messageService.encodeMessage({
      event: 'raise-hand',
      data: {
        viewer,
        stream,
      },
    });

    this.broadcast(ids, message);
  }

  async broadcastParticipantLeft({ user, stream }: ParticipantLeaveEvent) {
    const ids = await this.broadcastUserListStore.get(stream);

    const message = this.messageService.encodeMessage({
      event: 'user-left',
      data: {
        user,
        stream,
      },
    });

    this.broadcast(ids, message);
  }

  async broadcastNewParticipant(participant: IParticipant) {
    const ids = await this.broadcastUserListStore.get(participant.stream);

    const message = this.messageService.encodeMessage({
      event: 'new-participant',
      data: {
        stream: participant.stream,
        participant: participant,
      },
    });

    this.broadcast(ids, message);
  }

  //TODO: figure out a way to pass stream id along with the award data
  async broadcastNewAward({ award }: AwardSentEvent) {
    const currentStream = await this.participant.getStreamId(award.recipent.id);
    const ids = await this.participant.getParticipantIds(currentStream);

    const message = this.messageService.encodeMessage({
      event: 'new-award',
      data: {
        award,
      },
    });

    this.broadcast(ids, message);
  }
}
