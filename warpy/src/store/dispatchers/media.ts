import produce from 'immer';
import {MediaKind, Transport} from 'mediasoup-client/lib/types';
import {IStore} from '../useStore';
import {StoreSlice} from '../types';
import {MediaClient} from '@warpykit-sdk/client';

export interface IMediaDispatchers {
  dispatchMediaSend: (
    permissions: string,
    tracks: MediaKind[],
  ) => Promise<void>;
  dispatchInitViewer: (
    permissions: string,
    recvMediaParams: any,
  ) => Promise<void>;
  dispatchAudioToggle: (flag: boolean) => void;
  dispatchVideoToggle: (flag: boolean) => void;
  dispatchCameraSwitch: () => void;
  dispatchProducerClose: (producers: MediaKind[]) => void;
}

export const createMediaDispatchers: StoreSlice<IMediaDispatchers> = (
  set,
  get,
) => ({
  async dispatchInitViewer(permissions, recvMediaParams) {
    const {api, recvDevice, sendDevice} = get();

    if (!recvDevice.loaded) {
      await recvDevice.load({
        routerRtpCapabilities: recvMediaParams.routerRtpCapabilities,
      });
    }

    const mediaClient = new MediaClient(
      recvDevice,
      sendDevice,
      api,
      permissions,
    );

    set({
      mediaPermissionsToken: permissions,
      mediaClient,
      recvMediaParams,
    });
  },
  dispatchProducerClose(producers) {
    set(
      produce<IStore>(state => {
        producers.forEach(producer => {
          state[producer]?.producer?.close();
          state[producer] = undefined;
        });
      }),
    );
  },

  dispatchCameraSwitch() {
    (get().video?.track as any)._switchCamera();
  },

  dispatchAudioToggle(flag) {
    get()
      .audio?.stream.getAudioTracks()
      .forEach(audio => (audio.enabled = flag));

    set({
      audioMuted: flag,
    });
  },

  dispatchVideoToggle(_flag) {},

  async dispatchMediaSend(permissions, tracks) {
    const {mediaClient, stream, sendMediaParams, sendDevice} = get();

    if (!mediaClient) {
      return;
    }

    const {routerRtpCapabilities, sendTransportOptions} = sendMediaParams;

    if (!sendDevice.loaded) {
      await sendDevice.load({routerRtpCapabilities});
    }

    mediaClient.permissionsToken = permissions;
    mediaClient.sendDevice = sendDevice;

    let sendTransport = get().sendTransport;

    if (!sendTransport) {
      sendTransport = await mediaClient.createTransport({
        roomId: stream!,
        device: sendDevice,
        direction: 'send',
        options: {
          sendTransportOptions,
        },
        isProducer: true,
      });

      set({sendTransport});
    }

    tracks.forEach(async kind => {
      const track = get()[kind]?.track;

      if (track) {
        const producer = await mediaClient.sendMediaStream(
          track,
          kind,
          sendTransport as Transport,
        );

        set(
          produce<IStore>(state => {
            state[kind]!.producer = producer;
          }),
        );
      }
    });
  },
});
