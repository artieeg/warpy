import {MediaClient} from '@warpykit-sdk/client';
import {GetState, SetState} from 'zustand';
import {IStore} from '../useStore';

export interface IMediaSlice {
  mediaClient?: ReturnType<typeof MediaClient>;

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
}

export const createMediaSlice = (
  set: SetState<IStore>,
  get: GetState<IStore>,
): IMediaSlice => ({
  mediaPermissionsToken: null,

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
    const {api, recvDevice, sendDevice, initSendDevice} = get();

    await initSendDevice(sendMediaParams.routerRtpCapabilities);
    set({
      mediaPermissionsToken: permissions,
      mediaClient: MediaClient({
        recvDevice,
        sendDevice,
        api,
        permissionsToken: permissions,
      }),
      sendMediaParams,
    });
  },
});
