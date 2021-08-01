import { MediaDirection, MediaServiceRole } from "./types";
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup/lib/RtpParameters";
import {
  DtlsParameters,
  IceCandidate,
  IceParameters,
  SrtpParameters,
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
  //recvTransportOptions: ITransportOptions;
  sendTransportOptions: {
    video: ITransportOptions;
    audio: ITransportOptions;
  };
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
  rtpCapabilities: RtpCapabilities;
}

export interface IConnectMediaTransport {
  transportId: string;
  dtlsParameters: DtlsParameters;
  direction: MediaDirection;
  roomId: string;
  user: string;
}

export interface INewMediaTrack {
  transportId: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
  rtpCapabilities: RtpCapabilities;
  paused: boolean;
  roomId: string;
  direction: MediaDirection;
  appData: any;
}

export interface IRecvTracksRequest {
  roomId: string;
  user: string;
  rtpCapabilities: RtpCapabilities;
}

export interface IRecvTracksResponse {
  consumerParams: any[];
}

export interface IConnectMediaServer {
  node: string;
  ip: string;
  port: number;
  srtp?: SrtpParameters;
}

export interface INewProducer {
  id: string;
  kind: MediaKind;
  rtpParameters: RtpParameters;
  rtpCapabilities: RtpCapabilities;
  appData: any;
  roomId: string;
  userId: string;
}

export interface INewMediaNode {
  id: string;
  role: MediaServiceRole;
}

export interface IRequestViewers {
  user: string;
  stream: string;
  page: number;
}
