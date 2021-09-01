import { IMediaPermissions, IParticipant } from "./models";

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

export interface IClapsUpdate {
  stream: string;
  claps: number;
}
