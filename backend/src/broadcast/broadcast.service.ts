import { ParticipantStore } from '@backend_2/user/participant/store';
import {
  EVENT_ACTIVE_SPEAKERS,
  EVENT_AWARD_SENT,
  EVENT_CHAT_MESSAGE,
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_KICKED,
  EVENT_PARTICIPANT_LEAVE,
  EVENT_RAISE_HAND,
  EVENT_REACTIONS,
  EVENT_ROLE_CHANGE,
} from '@backend_2/utils';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IParticipant } from '@warpy/lib';
import { MessageService } from '../message/message.service';
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
    const ids = await this.participant.getParticipantIds(stream);

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

  @OnEvent(EVENT_PARTICIPANT_KICKED)
  async broadcastKickedParticipant(participant: IParticipant) {
    const { stream, id } = participant;

    const ids = await this.participant.getParticipantIds(stream);

    const payload = this.messageService.encodeMessage({
      event: 'user-kicked',
      data: {
        user: id,
        stream,
      },
    });

    this.broadcast(ids, payload);
  }

  @OnEvent(EVENT_CHAT_MESSAGE)
  async broadcastChatMessage({ idsToBroadcast, message }: ChatMessageEvent) {
    const payload = this.messageService.encodeMessage({
      event: 'chat-message',
      data: {
        message,
      },
    });

    this.broadcast(idsToBroadcast, payload);
  }

  @OnEvent(EVENT_REACTIONS)
  async broadcastReactions({ stream, reactions }: ReactionsEvent) {
    const ids = await this.participant.getParticipantIds(stream);

    const message = this.messageService.encodeMessage({
      event: 'reactions-update',
      data: {
        stream,
        reactions,
      },
    });

    this.broadcast(ids, message);
  }

  @OnEvent(EVENT_ACTIVE_SPEAKERS)
  async broadcastActiveSpeakers({
    stream,
    activeSpeakers,
  }: ActiveSpeakersEvent) {
    const ids = await this.participant.getParticipantIds(stream);

    const message = this.messageService.encodeMessage({
      event: 'active-speaker',
      data: {
        stream: stream,
        speakers: activeSpeakers,
      },
    });

    this.broadcast(ids, message);
  }

  @OnEvent(EVENT_ROLE_CHANGE)
  async broadcastRoleChange(user: IParticipant) {
    const ids = await this.participant.getParticipantIds(user.stream);

    const message = this.messageService.encodeMessage({
      event: 'participant-role-change',
      data: {
        user,
      },
    });

    this.broadcast(ids, message);
  }

  @OnEvent(EVENT_RAISE_HAND)
  async broadcastHandRaise(viewer: IParticipant) {
    const { stream } = viewer;
    const ids = await this.participant.getParticipantIds(stream);

    const message = this.messageService.encodeMessage({
      event: 'raise-hand',
      data: {
        viewer,
        stream,
      },
    });

    this.broadcast(ids, message);
  }

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async broadcastParticipantLeft({ user, stream }: ParticipantLeaveEvent) {
    const ids = await this.participant.getParticipantIds(stream);

    const message = this.messageService.encodeMessage({
      event: 'user-left',
      data: {
        user,
        stream,
      },
    });

    this.broadcast(ids, message);
  }

  @OnEvent(EVENT_NEW_PARTICIPANT, { async: true })
  async broadcastNewParticipant(participant: IParticipant) {
    const ids = await this.participant.getParticipantIds(participant.stream);

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
  @OnEvent(EVENT_AWARD_SENT, { async: true })
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
