import { IMediaPermissions, IParticipant } from "./models";

export interface ISpeakingAllowedEvent {
  stream: string;
  media: any;
  mediaPermissionToken: IMediaPermissions;
}

export interface IActiveSpeakerEvent {
  stream: string;
  speaker: IParticipant;
}
