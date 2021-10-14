import {MediaClient} from '@warpykit-sdk/client';
import {GetState, SetState} from 'zustand';
import {IStore} from '../useStore';
import {MediaStream, MediaStreamTrack} from 'react-native-webrtc';
import {Transport} from 'mediasoup-client/lib/Transport';

export interface IMediaSlice {
  mediaClient?: MediaClient;
  video?: {
    stream: MediaStream;
    track: MediaStreamTrack;
  };
  audio?: {
    stream: MediaStream;
    track: MediaStreamTrack;
  };
  audioMuted: boolean;

  sendTransport: Transport | null;

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

  sendMedia: (
    permissions: string,
    sendMediaParams: any,
    tracks: ('audio' | 'video')[],
  ) => Promise<void>;

  initViewerMedia: (permissions: string, recvMediaParams: any) => Promise<void>;

  toggleAudio: (flag: boolean) => void;
  toggleVideo: (flag: boolean) => void;
  switchCamera: () => void;
}

export const createMediaSlice = (
  set: SetState<IStore>,
  get: GetState<IStore>,
): IMediaSlice => ({
  sendTransport: null,
  mediaPermissionsToken: null,
  audioMuted: false,

  switchCamera() {
    (get().video?.track as any)._switchCamera();
  },

  toggleAudio(flag) {
    get()
      .audio?.stream.getAudioTracks()
      .forEach(audio => (audio.enabled = flag));

    set({
      audioMuted: flag,
    });
  },

  toggleVideo(_flag) {},

  async initViewerMedia(permissions, recvMediaParams) {
    const {api, recvDevice, sendDevice, initRecvDevice} = get();

    await initRecvDevice(recvMediaParams.routerRtpCapabilities);

    set({
      mediaPermissionsToken: permissions,
      mediaClient: new MediaClient(recvDevice, sendDevice, api, permissions),
      recvMediaParams,
    });
  },

  async sendMedia(permissions, sendMediaParams, tracks) {
    const {mediaClient, stream, sendDevice, initSendDevice} = get();

    if (!mediaClient) {
      return;
    }

    const {routerRtpCapabilities, sendTransportOptions} = sendMediaParams;

    await initSendDevice(routerRtpCapabilities);

    mediaClient.permissionsToken = permissions;
    mediaClient.sendDevice = sendDevice;

    const sendTransport = await mediaClient.createTransport({
      roomId: stream!,
      device: sendDevice,
      direction: 'send',
      options: {
        sendTransportOptions: sendTransportOptions,
      },
      isProducer: true,
    });

    tracks.forEach(async kind => {
      const track = get()[kind]?.track;
      console.log({track, kind});

      if (track) {
        const producer = await mediaClient.sendMediaStream(
          track,
          kind,
          sendTransport,
        );

        console.log('producer', producer);
      }
    });

    /*
    set({
      mediaPermissionsToken: permissions,
      sendMediaParams,
      sendTransport,
    });
    */
  },
});
