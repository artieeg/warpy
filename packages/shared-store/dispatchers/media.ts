import produce from "immer";
import { MediaKind, Transport } from "mediasoup-client/lib/types";
import { IStore } from "../useStore";
import { StoreSlice } from "../types";
import { MediaClient } from "@warpy/media";
import { container } from "../container";

export interface IMediaDispatchers {
  dispatchMediaSend: (
    permissions: string,
    tracks: MediaKind[],
    startSending?: boolean
  ) => Promise<void>;
  dispatchInitViewer: (
    permissions: string,
    recvMediaParams: any
  ) => Promise<void>;
  dispatchAudioToggle: () => Promise<void>;
  dispatchVideoToggle: () => Promise<void>;
  dispatchCameraSwitch: () => void;
  dispatchProducerClose: (producers: MediaKind[]) => void;
  dispatchTrackAdd: (user: string, consumerParameters: any) => Promise<void>;
  dispatchMediaRequest: (
    kind: MediaKind,
    params?: { enabled?: boolean }
  ) => Promise<void>;
  dispatchMediaClose: () => Promise<void>;
}

export const createMediaDispatchers: StoreSlice<IMediaDispatchers> = (
  set,
  get
) => ({
  async dispatchTrackAdd(user, consumerParameters) {
    const { mediaClient, recvTransport } = get();

    if (mediaClient && recvTransport) {
      const consumer = await mediaClient.consumeRemoteStream(
        consumerParameters,
        user,
        recvTransport
      );

      const stream = new MediaStream([consumer.track]);
      const key = consumer.kind === "audio" ? "audioStreams" : "videoStreams";

      set(
        produce<IStore>((state) => {
          state[key][user] = {
            consumer,
            stream,
            enabled: true,
          };
        })
      );
    }
  },

  async dispatchMediaClose() {
    //TODO: check once I have the internet connection

    //get().video?.track.stop();
    //get().audio?.track.stop();

    //get().video?.track.release();
    //get().audio?.track.release();

    get().video?.stream.release();
    get().audio?.stream.release();

    set({
      audioEnabled: false,
      videoEnabled: false,
      video: undefined,
      audio: undefined,
    });
  },

  async dispatchMediaRequest(kind, params) {
    const videoContstraints: any = {
      facingMode: "user",
      mandatory: {
        minWidth: 720,
        minHeight: 1080,
        minFrameRate: 30,
      },
      optional: [],
    };

    //getUserMedia returns boolean | MediaStream
    const mediaStream = await container.mediaDevices.getUserMedia({
      audio: true,
      video: kind === "video" ? videoContstraints : false,
    });

    //F
    if (!mediaStream || mediaStream === true) {
      return;
    }

    if (!params?.enabled) {
      mediaStream
        .getAudioTracks()
        .forEach((track: any) => (track.enabled = false));
      mediaStream
        .getVideoTracks()
        .forEach((track: any) => (track.enabled = false));
    }

    if (kind === "video") {
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
    const { api, recvDevice, sendDevice } = get();

    if (!recvDevice.loaded) {
      await recvDevice.load({
        routerRtpCapabilities: recvMediaParams.routerRtpCapabilities,
      });
    }

    const mediaClient = new MediaClient(
      recvDevice,
      sendDevice,
      api,
      permissions
    );

    set({
      mediaPermissionsToken: permissions,
      mediaClient,
      recvMediaParams,
    });
  },

  dispatchProducerClose(producers) {
    set(
      produce<IStore>((state) => {
        producers.forEach((producer) => {
          state[producer]?.producer?.close();
          state[producer] = undefined;
        });
      })
    );
  },

  dispatchCameraSwitch() {
    (get().video?.track as any)._switchCamera();
  },

  async dispatchAudioToggle() {
    const { api, stream, audio, audioEnabled } = get();

    if (stream) {
      await api.stream.toggleMedia({ audioEnabled });
    }

    audio?.stream
      .getAudioTracks()
      .forEach((audio: any) => (audio.enabled = !audioEnabled));

    set({
      audioEnabled: !audioEnabled,
    });
  },

  async dispatchVideoToggle() {
    const { api, stream, video, videoEnabled } = get();

    if (stream) {
      await api.stream.toggleMedia({ videoEnabled: !videoEnabled });
    }

    video?.stream
      .getVideoTracks()
      .forEach((video: any) => (video.enabled = !videoEnabled));

    set({
      videoEnabled: !videoEnabled,
    });
  },

  async dispatchMediaSend(permissions, tracks, startSending) {
    const { mediaClient, stream, sendMediaParams, sendDevice } = get();

    if (!mediaClient) {
      return;
    }

    const { routerRtpCapabilities, sendTransportOptions } = sendMediaParams;

    if (!sendDevice.loaded) {
      //Fix orientation issue
      routerRtpCapabilities.headerExtensions =
        routerRtpCapabilities.headerExtensions.filter(
          (ext: { uri: string }) => ext.uri !== "urn:3gpp:video-orientation"
        );

      await sendDevice.load({ routerRtpCapabilities });
    }

    mediaClient.permissionsToken = permissions;
    mediaClient.sendDevice = sendDevice;

    let sendTransport = get().sendTransport;

    if (!sendTransport) {
      sendTransport = await mediaClient.createTransport({
        roomId: stream!,
        device: sendDevice,
        direction: "send",
        options: {
          sendTransportOptions,
        },
        isProducer: true,
      });

      set({ sendTransport });
    }

    tracks.forEach(async (kind) => {
      let media = get()[kind];
      if (!media) {
        await get().dispatchMediaRequest(kind, { enabled: !!startSending });

        media = get()[kind];
      }
      const track = media!.track;

      if (track) {
        const producer = await mediaClient.sendMediaStream(
          track,
          kind,
          sendTransport as Transport
        );

        set(
          produce<IStore>((state) => {
            state[kind]!.producer = producer;
          })
        );
      }
    });
  },
});
