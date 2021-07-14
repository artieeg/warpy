import { MediaDirection } from "@app/types";
import {
  MediaKind,
  RtpCapabilities,
  RtpParameters,
} from "mediasoup/lib/RtpParameters";

export interface ICreateNewRoom {
  host: string;
  roomId: string;
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
