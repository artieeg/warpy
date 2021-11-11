import produce from 'immer';
import {MediaKind, Transport} from 'mediasoup-client/lib/types';
import {IStore} from '../useStore';
import {StoreSlice} from '../types';
import {MediaClient} from '@warpykit-sdk/client';
import {mediaDevices, MediaTrackConstraints} from 'react-native-webrtc';

export interface IMediaDispatchers {
  dispatchMediaSend: (
    permissions: string,
    tracks: MediaKind[],
    startSending?: boolean,
  ) => Promise<void>;
  dispatchInitViewer: (
    permissions: string,
    recvMediaParams: any,
  ) => Promise<void>;
  dispatchAudioToggle: () => Promise<void>;
  dispatchVideoToggle: () => Promise<void>;
  dispatchCameraSwitch: () => void;
  dispatchProducerClose: (producers: MediaKind[]) => void;
  dispatchMediaRequest: (
    kind: MediaKind,
    params?: {enabled?: boolean},
  ) => Promise<void>;
}

export const createMediaDispatchers: StoreSlice<IMediaDispatchers> = (
  set,
  get,
) => ({
  async dispatchMediaRequest(kind, params) {
    const videoContstraints: MediaTrackConstraints = {
      facingMode: 'user',
      mandatory: {
        minWidth: 720,
        minHeight: 1080,
        minFrameRate: 30,
      },
      optional: [],
    };

    //getUserMedia returns boolean | MediaStream
    const mediaStream = await mediaDevices.getUserMedia({
      audio: {
        sampleRate: 48000,
      } as any,
      video: kind === 'video' ? videoContstraints : false,
    });

    //F
    if (!mediaStream || mediaStream === true) {
      return;
    }

    if (!params?.enabled) {
      mediaStream.getAudioTracks().forEach(track => (track.enabled = false));
      mediaStream.getVideoTracks().forEach(track => (track.enabled = false));
    }

    if (kind === 'video') {
      set({
        videoEnabled: !!params?.enabled,
        video: {
          stream: mediaStream,
          track: mediaStream.getVideoTracks()[0],
        },
      });
    } else {
      set({
        audioEnabled: !!params?.enabled,
        audio: {
          stream: mediaStream,
          track: mediaStream.getAudioTracks()[0],
        },
      });
    }
  },

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

  async dispatchAudioToggle() {
    const {api, audio, audioEnabled} = get();
    await api.stream.toggleMedia({audioEnabled});

    audio?.stream
      .getAudioTracks()
      .forEach(audio => (audio.enabled = !audioEnabled));

    set({
      audioEnabled: !audioEnabled,
    });
  },

  async dispatchVideoToggle() {
    const {api, video, videoEnabled} = get();

    await api.stream.toggleMedia({videoEnabled});
    video?.stream
      .getVideoTracks()
      .forEach(video => (video.enabled = !videoEnabled));

    set({
      videoEnabled: !videoEnabled,
    });
  },

  async dispatchMediaSend(permissions, tracks, startSending) {
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
      let media = get()[kind];
      if (!media) {
        await get().dispatchMediaRequest(kind, {enabled: !!startSending});

        media = get()[kind];
      }
      const track = media!.track;

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
