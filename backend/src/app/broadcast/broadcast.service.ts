import { BroadcastUserListStore } from '@warpy-be/app';
import { MessageService } from '../message';
import { Award, Participant } from '@warpy/lib';

export type MediaToggleEvent = {
  user: string;
  stream: string;
  videoEnabled?: boolean;
  audioEnabled?: boolean;
};

export type ChatMessageEvent = {
  idsToBroadcast: string[];
  message: string;
};

export type ReactionsEvent = {
  stream: string;
  reactions: any;
};

export type ActiveSpeakersEvent = {
  stream: string;
  activeSpeakers: { user: string; volume: number }[];
};

export type ParticipantLeaveEvent = {
  user: string;
  stream: string;
};

export type AwardSentEvent = {
  award: Award;
};

type BroadcastData<T = any> = {
  event: string;
  data: T;
};

export class BroadcastService {
  constructor(
    private messageService: MessageService,
    private broadcastUserListStore: BroadcastUserListStore,
  ) {}

  private _broadcast(ids: string[], message: Uint8Array) {
    ids.forEach((id) => this.messageService.send(id, message));
  }

  broadcast(ids: string[], payload: BroadcastData) {
    const enc = this.messageService.encodeMessage(payload);

    this._broadcast(ids, enc);
  }

  async broadcastStreamEnd(stream: string) {
    const ids = await this.broadcastUserListStore.get(stream);

    const payload = this.messageService.encodeMessage({
      event: 'stream-end',
      data: {
        stream,
      },
    });

    this._broadcast(ids, payload);
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

    this._broadcast(ids, payload);
  }

  async broadcastKickedParticipant(participant: Participant) {
    const { stream, id } = participant;

    const ids = await this.broadcastUserListStore.get(stream);

    const payload = this.messageService.encodeMessage({
      event: 'user-kicked',
      data: {
        user: id,
        stream,
      },
    });

    this._broadcast(ids, payload);
  }

  async broadcastChatMessage({ idsToBroadcast, message }: ChatMessageEvent) {
    const payload = this.messageService.encodeMessage({
      event: 'chat-message',
      data: {
        message,
      },
    });

    this._broadcast(idsToBroadcast, payload);
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

    this._broadcast(ids, message);
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

    this._broadcast(ids, message);
  }

  async broadcastRoleChange(user: Participant) {
    const ids = await this.broadcastUserListStore.get(user.stream);

    const message = this.messageService.encodeMessage({
      event: 'participant-role-change',
      data: {
        user,
      },
    });

    this._broadcast(ids, message);
  }

  async broadcastHandRaise(viewer: Participant) {
    const { stream } = viewer;

    const ids = await this.broadcastUserListStore.get(stream);

    const message = this.messageService.encodeMessage({
      event: 'raise-hand',
      data: {
        viewer,
        stream,
      },
    });

    this._broadcast(ids, message);
  }
}
