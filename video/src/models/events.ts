import { MediaDirection } from "@app/types";
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup/lib/RtpParameters";
import { DtlsParameters } from "mediasoup/lib/WebRtcTransport";

export interface ICreateNewRoom {
  host: string;
  roomId: string;
}

export interface IConnectTransport {
  roomId: string;
  user: string;
  dtlsParameters: DtlsParameters;
  direction: MediaDirection;
}

export interface INewTrack {
  roomId: string;
  user: string;
  direction: MediaDirection;
  kind: MediaKind;
  rtpParameters: RtpParameters;
  rtpCapabilities: RtpCapabilities;
  appData: any;
  transportId: string;
}

export interface IJoinRoom {
  roomId: string;
  user: string;
}

export interface IRecvTracksRequest {
  roomId: string;
  user: string;
  rtpCapabilities: RtpCapabilities;
}

export interface INewSpeaker {
  roomId: string;
  speaker: string;
}
