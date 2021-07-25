export interface IRoom {
  id: string;
  owner: string;
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
