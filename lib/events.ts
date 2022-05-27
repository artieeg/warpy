import {
  IAward,
  IChatMessage,
  IInvite,
  INotification,
  IParticipant,
  IStream,
} from "./models";
import { InviteStates, Roles } from "./types";

export interface IRoleUpdateEvent {
  stream: string;
  sendMediaParams?: any;
  mediaPermissionToken: string;
  role: Roles;
}

export interface IActiveSpeakerEvent {
  stream: string;
  speakers: { user: string; volume: number }[];
}

export interface INewPreviewEvent {
  stream: string;
  preview: string;
}

export interface IReactionsUpdate {
  stream: string;
  reactions: {
    emoji: string;
    user: string;
  }[];
}

export interface IChatMessagesEvent {
  messages: IChatMessage[];
}

export interface IUserKickedEvent {
  user: string;
  stream: string;
}

export interface INotificationEvent {
  notification: INotification;
}

export interface INotificationDeleteEvent {
  notification_id: string;
}

export interface IParticipantRoleChangeEvent {
  user: IParticipant;
}

export interface IMediaToggleEvent {
  user: string;
  stream: string;
  videoEnabled?: boolean;
  audioEnabled?: boolean;
}

export interface IBotDevConfirmation {
  confirmation_id: string;
  bot: {
    botname: string;
    avatar: string;
    name: string;
  };
}

export interface IBotInviteEvent {
  stream: string;
  inviteDetailsToken: string;
}

export interface INewParticipantEvent {
  participant: IParticipant;
}

export interface IStreamIdAvailable {
  id: string;
}

export interface IInviteStateUpdate {
  id: string;
  state: InviteStates;
}

export interface INewAward {
  award: IAward;
}

export interface IPreviousStream {
  stream: IStream;
}

export interface IReassignedStreamHost {
  host: IParticipant;
}

export interface IStreamEndEvent {
  stream: string;
}

export interface IReceivedInviteEvent {
  invite: IInvite;
}
