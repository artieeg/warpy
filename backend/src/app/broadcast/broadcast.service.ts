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
