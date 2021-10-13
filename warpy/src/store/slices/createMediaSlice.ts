import {MediaClient} from '@warpykit-sdk/client';
import {GetState, SetState} from 'zustand';
import {IStore} from '../useStore';
import {MediaStream} from 'react-native-webrtc';
import {Transport} from 'mediasoup-client/lib/Transport';

export interface IMediaSlice {
  mediaClient?: ReturnType<typeof MediaClient>;
  video?: MediaStream;
  audio?: MediaStream;
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

  initSpeakerMedia: (
    permissions: string,
    sendMediaParams: any,
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
    (get().video?.getVideoTracks()[0] as any)._switchCamera();
  },

  toggleAudio(flag) {
    get()
      .audio?.getAudioTracks()
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
      mediaClient: MediaClient({
        recvDevice,
        sendDevice,
        api,
        permissionsToken: permissions,
      }),
      recvMediaParams,
    });
  },

  async initSpeakerMedia(permissions, sendMediaParams) {
    const {api, mediaClient, stream, recvDevice, sendDevice, initSendDevice} =
      get();

    if (!mediaClient) {
      return;
    }

    const {routerRtpCapabilities, sendTransportOptions} = sendMediaParams;

    await initSendDevice(routerRtpCapabilities);

    const sendTransport = await mediaClient.createTransport({
      roomId: stream!,
      device: sendDevice,
      permissionsToken: permissions,
      direction: 'send',
      options: {
        sendTransportOptions: sendTransportOptions,
      },
      isProducer: true,
    });

    set({
      mediaPermissionsToken: permissions,
      mediaClient: MediaClient({
        recvDevice,
        sendDevice,
        api,
        permissionsToken: permissions,
      }),
      sendMediaParams,
      sendTransport,
    });
  },
});
