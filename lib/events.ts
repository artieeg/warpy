import {
  Award,
  ChatMessage,
  Invite,
  Notification,
  Participant,
  Stream,
} from "./models";
import { InviteStates, Roles } from "./types";

export interface EventRoleUpdate {
  stream: string;
  sendMediaParams?: any;
  mediaPermissionToken: string;
  role: Roles;
}

export interface EventActiveSpeaker {
  stream: string;
  speakers: { user: string; volume: number }[];
}

export interface EventNewPreview {
  stream: string;
  preview: string;
}

export interface EventNewReactions {
  stream: string;
  reactions: {
    emoji: string;
    user: string;
  }[];
}

export interface EventChatMessages {
  messages: ChatMessage[];
}

export interface EventKickedUser {
  user: string;
  stream: string;
}

export interface EventNewNotification {
  notification: Notification;
}

export interface EventNotificationDeleted {
  notification_id: string;
}

export interface EventParticipantRoleChange {
  user: Participant;
}

export interface EventMediaToggle {
  user: string;
  stream: string;
  videoEnabled?: boolean;
  audioEnabled?: boolean;
}

export interface EventBotDevConfirmation {
  confirmation_id: string;
  bot: {
    botname: string;
    avatar: string;
    name: string;
  };
}

export interface EventBotInvite {
  stream: string;
  inviteDetailsToken: string;
}

export interface EventNewParticipant {
  participant: Participant;
}

export interface EventStreamIdAvailable {
  id: string;
}

export interface EventInviteStateUpdate {
  id: string;
  state: InviteStates;
}

export interface EventNewAward {
  award: Award;
}

export interface EventPreviousStream {
  stream: Stream;
}

export interface EventReassignedStreamHost {
  host: Participant;
}

export interface EventStreamEnd {
  stream: string;
}

export interface EventReceivedInvite {
  invite: Invite;
}
