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
import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IParticipant } from '@warpy/lib';
import { BroadcastService } from './broadcast.service';
import {
  ActiveSpeakersEvent,
  AwardSentEvent,
  ChatMessageEvent,
  MediaToggleEvent,
  ParticipantLeaveEvent,
  ReactionsEvent,
} from './types';

@Controller()
export class BroadcastController {
  constructor(private broadcast: BroadcastService) {}

  @OnEvent('participant.media-toggle')
  async onMediaToggle(data: MediaToggleEvent) {
    return this.broadcast.broadcastMediaToggle(data);
  }

  @OnEvent(EVENT_PARTICIPANT_KICKED)
  async onParticipantKicked(data: IParticipant) {
    return this.broadcast.broadcastKickedParticipant(data);
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
  async onRoleChange(data: IParticipant) {
    return this.broadcast.broadcastRoleChange(data);
  }

  @OnEvent(EVENT_RAISE_HAND)
  async onRaiseHand(data: IParticipant) {
    return this.broadcast.broadcastHandRaise(data);
  }

  @OnEvent(EVENT_PARTICIPANT_LEAVE)
  async onParticipantLeave(data: ParticipantLeaveEvent) {
    return this.broadcast.broadcastParticipantLeft(data);
  }

  @OnEvent(EVENT_NEW_PARTICIPANT, { async: true })
  async onBroadcastParticipant(participant: IParticipant) {
    return this.broadcast.broadcastNewParticipant(participant);
  }

  @OnEvent(EVENT_AWARD_SENT, { async: true })
  async onAward(data: AwardSentEvent) {
    return this.broadcast.broadcastNewAward(data);
  }
}
