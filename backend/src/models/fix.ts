import { Roles } from "@conv/types";

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

export interface IRequestGetTracks {
  user: string;
  stream: string;
  rtpCapabilities: any;
}
