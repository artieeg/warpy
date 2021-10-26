import { MediaDirection } from "@media/types";
import { DtlsParameters } from "mediasoup/lib/WebRtcTransport";

export interface IConnectTransport {
  roomId: string;
  user: string;
  dtlsParameters: DtlsParameters;
  direction: MediaDirection;
  mediaPermissionsToken: string;
}
