import { MediaDirection } from "@video/types";
import { RtpCapabilities } from "mediasoup/lib/RtpParameters";
import { DtlsParameters } from "mediasoup/lib/WebRtcTransport";

export interface IConnectTransport {
  roomId: string;
  user: string;
  dtlsParameters: DtlsParameters;
  direction: MediaDirection;
}
