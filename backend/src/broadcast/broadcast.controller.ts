import {
  OnHostReassign,
  OnNewParticipant,
  OnParticipantRejoin,
  OnRoleChange,
  OnStreamEnd,
} from '@warpy-be/interfaces';
import {
  EVENT_ACTIVE_SPEAKERS,
  EVENT_AWARD_SENT,
  EVENT_CHAT_MESSAGE,
  EVENT_HOST_REASSIGN,
  EVENT_NEW_PARTICIPANT,
  EVENT_PARTICIPANT_KICKED,
  EVENT_PARTICIPANT_LEAVE,
  EVENT_PARTICIPANT_REJOIN,
  EVENT_RAISE_HAND,
  EVENT_REACTIONS,
  EVENT_ROLE_CHANGE,
  EVENT_STREAMER_MEDIA_TOGGLE,
  EVENT_STREAM_ENDED,
} from '@warpy-be/utils';
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IParticipant } from '@warpy/lib';
import { NjsBroadcastUserListStore } from './broadcast-user-list.store';
import { NjsBroadcastService } from './broadcast.service';
import {
  ActiveSpeakersEvent,
  AwardSentEvent,
  ChatMessageEvent,
  MediaToggleEvent,
  ParticipantLeaveEvent,
  ReactionsEvent,
} from './types';

@Controller()
export class BroadcastController
  implements
    OnStreamEnd,
    OnParticipantRejoin,
    OnNewParticipant,
    OnRoleChange,
    OnHostReassign
{
  constructor(
    private broadcast: NjsBroadcastService,
    private store: NjsBroadcastUserListStore,
  ) {}

  @OnEvent(EVENT_HOST_REASSIGN)
  async onHostReassign({ host }) {
    return this.broadcast.broadcastNewHost({ host });
  }

  @OnEvent(EVENT_STREAM_ENDED)
  async onStreamEnd({ stream }) {
    await this.broadcast.broadcastStreamEnd(stream);
    await this.store.deleteList(stream);
  }

  @OnEvent(EVENT_STREAMER_MEDIA_TOGGLE)
  async onMediaToggle(data: MediaToggleEvent) {
    return this.broadcast.broadcastMediaToggle(data);
  }

  @OnEvent(EVENT_PARTICIPANT_KICKED)
  async onParticipantKicked(data: IParticipant) {
    return Promise.all([
      this.broadcast.broadcastKickedParticipant(data),
      this.store.removeUserFromList(data.stream, data.id),
    ]);
  }

  @OnEvent(EVENT_CHAT_MESSAGE)
  async onChatMessage(data: ChatMessageEvent) {
    return this.broadcast.broadcastChatMessage(data);
  }

  @OnEvent(EVENT_REACTIONS)
  async onReactions(data: ReactionsEvent) {
    return this.broadcast.broadcastReactions(data);
  }

  @OnEvent(EVENT_ACTIVE_SPEAKERS)
  async onActiveSpeakers(data: ActiveSpeakersEvent) {
    return this.broadcast.broadcastActiveSpeakers(data);
  }

  @OnEvent(EVENT_ROLE_CHANGE)
  async onRoleChange({ participant }) {
    return this.broadcast.broadcastRoleChange(participant);
  }

  @OnEvent(EVENT_RAISE_HAND)
  async onRaiseHand(data: IParticipant) {
    console.log(data);
    return this.broadcast.broadcastHandRaise(data);
  }

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave(data: ParticipantLeaveEvent) {
    return Promise.all([
      this.broadcast.broadcastParticipantLeft(data),
      this.store.removeUserFromList(data.stream, data.user),
    ]);
  }

  private async onParticipantJoin(participant: IParticipant) {
    return Promise.all([
      this.broadcast.broadcastNewParticipant(participant),
      this.store.addUserToList(participant.stream, participant.id),
    ]);
  }

  @OnEvent(EVENT_PARTICIPANT_REJOIN, { async: true })
  async onParticipantRejoin({ participant }) {
    return this.onParticipantJoin(participant);
  }

  @OnEvent(EVENT_NEW_PARTICIPANT, { async: true })
  async onNewParticipant({ participant }) {
    return this.onParticipantJoin(participant);
  }

  @OnEvent(EVENT_AWARD_SENT, { async: true })
  async onAward(data: AwardSentEvent) {
    return this.broadcast.broadcastNewAward(data);
  }
}
