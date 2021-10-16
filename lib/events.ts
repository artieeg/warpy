import { IChatMessage, INotification, IParticipant } from "./models";
import { Roles } from "./types";

export interface IRoleUpdateEvent {
  stream: string;
  media?: any;
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
