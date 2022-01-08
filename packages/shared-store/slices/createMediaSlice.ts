import { MediaClient } from "@warpy/media";
import { Transport, Producer } from "mediasoup-client/lib/types";
import { StoreSlice } from "../types";

export interface IMediaSlice {
  mediaClient?: MediaClient;
  video?: {
    stream: any;
    track: any;
    producer?: Producer;
  };
  audio?: {
    stream: any;
    track: any;
    producer?: Producer;
  };
  audioEnabled: boolean;
  videoEnabled: boolean;
  audioTracks: any[];
  videoTracks: any[];

  sendTransport: Transport | null;
  recvTransport: Transport | null;

  /**
   * Mediasoup recv params
   */
  recvMediaParams?: any;

  /**
   * Mediasoup send params
   */
  sendMediaParams?: any;

  /**
   * Stores audio/video streaming permissions
   * */
  mediaPermissionsToken: string | null;
}

export const createMediaSlice: StoreSlice<IMediaSlice> = (): IMediaSlice => ({
  audioTracks: [],
  videoTracks: [],
  sendTransport: null,
  mediaPermissionsToken: null,
  audioEnabled: false,
  videoEnabled: false,
  recvTransport: null,
});
