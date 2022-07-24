import { ParticipantStore, BroadcastUserListStore } from 'lib';
import { MessageService } from '../message';
import { IAward, IParticipant } from '@warpy/lib';

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

export type NewHostEvent = {
  host: IParticipant;
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
  award: IAward;
};

export class BroadcastService {
  constructor(
    private participant: ParticipantStore,
    private messageService: MessageService,
    private broadcastUserListStore: BroadcastUserListStore,
  ) {}

  private broadcast(ids: string[], message: Uint8Array) {
    ids.forEach((id) => this.messageService.send(id, message));
  }

  async broadcastStreamEnd(stream: string) {
    const ids = await this.broadcastUserListStore.get(stream);

    const payload = this.messageService.encodeMessage({
      event: 'stream-end',
      data: {
        stream,
      },
    });

    this.broadcast(ids, payload);
  }

  async broadcastNewHost({ host }: NewHostEvent) {
    const ids = await this.broadcastUserListStore.get(host.stream);

    const payload = this.messageService.encodeMessage({
      event: 'stream-host-reassigned',
      data: {
        host,
      },
    });

    this.broadcast(ids, payload);
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
