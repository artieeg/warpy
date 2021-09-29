import {
  IChatMessage,
  IMediaPermissions,
  INotification,
  IParticipant,
} from "./models";

export interface ISpeakingAllowedEvent {
  stream: string;
  media: any;
  mediaPermissionToken: string;
}

export interface IActiveSpeakerEvent {
  stream: string;
  speaker: IParticipant;
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
