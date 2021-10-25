import {MediaClient} from '@warpykit-sdk/client';
import {MediaStream, MediaStreamTrack} from 'react-native-webrtc';
import {Transport, Producer} from 'mediasoup-client/lib/types';
import {StoreSlice} from '../types';

export interface IMediaSlice {
  mediaClient?: MediaClient;
  video?: {
    stream: MediaStream;
    track: MediaStreamTrack;
    producer?: Producer;
  };
  audio?: {
    stream: MediaStream;
    track: MediaStreamTrack;
    producer?: Producer;
  };
  audioMuted: boolean;
  videoStopped: boolean;

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
  sendTransport: null,
  mediaPermissionsToken: null,
  audioMuted: false,
  videoStopped: false,
  recvTransport: null,
});
