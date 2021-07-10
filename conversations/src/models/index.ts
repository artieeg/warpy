import { Roles } from "@app/types";

export interface IStream {
  id: string;
  owner: string;
}

export interface IParticipant {
  id: string;
  stream: string;
  role?: Roles;
}

export interface IAllowSpeakerPayload {
  speaker: string;
  user: string;
}

export interface INewTrackPayload {
  user: string;
  track: string;
}
