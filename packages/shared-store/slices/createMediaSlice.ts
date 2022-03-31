import { MediaClient } from "@warpy/media";
import { Transport, Producer, Consumer } from "mediasoup-client/lib/types";
import { StoreSlice } from "../types";

export type MediaStreamMap = Record<
  string,
  {
    consumer: Consumer;
    stream: any;
    enabled: boolean;
  }
>;

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

  sendTransport: Transport | null;
  recvTransport: Transport | null;

  videoStreams: MediaStreamMap;
  audioStreams: MediaStreamMap;

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
  audioStreams: {},
  videoStreams: {},
  sendTransport: null,
  mediaPermissionsToken: null,
  audioEnabled: false,
  videoEnabled: false,
  recvTransport: null,
});
