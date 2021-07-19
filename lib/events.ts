import { MediaDirection } from "./types";
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup/lib/RtpParameters";
import {
  DtlsParameters,
  IceCandidate,
  IceParameters,
} from "mediasoup/lib/types";

export interface ITransportOptions {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
}

export interface ICreateMediaRoom {
  host: string;
  roomId: string;
}

export interface INewMediaRoomData {
  routerRtpCapabilities: RtpCapabilities;
  recvTransportOptions: ITransportOptions;
  sendTransportOptions: ITransportOptions;
}

export interface INewMediaTrack {
  roomId: string;
  user: string;
  direction: MediaDirection;
  kind: MediaKind;
  rtpParameters: RtpParameters;
  rtpCapabilities: RtpCapabilities;
  transportId: string;
  appData: any;
}

export interface IJoinMediaRoom {
  roomId: string;
  user: string;
}

export interface IConnectNewSpeakerMedia {
  roomId: string;
  speaker: string;
}

export interface INewSpeakerMediaResponse {
  sendTransportOptions: ITransportOptions;
}
