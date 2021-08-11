import { MediaDirection } from "@media/types";
import { MediaKind } from "mediasoup/lib/RtpParameters";
import { DtlsParameters } from "mediasoup/lib/WebRtcTransport";
import { IMediaPermissions } from "@warpy/lib";

export interface IConnectTransport {
  roomId: string;
  user: string;
  dtlsParameters: DtlsParameters;
  direction: MediaDirection;
  mediaKind?: MediaKind;
  mediaPermissionsToken: string;
}
