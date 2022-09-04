import { Participant } from "@warpy/lib";
import { Transport, Producer } from "mediasoup-client/lib/types";
import { Roles, MediaKind } from "@warpy/lib";
import { MediaClient } from "@warpy/media";
import { container } from "../container";
import { Service } from "../Service";
import { MediaStreamMap } from "../types";
import { Device, detectDevice } from "mediasoup-client";

export interface MediaData {
  recvDevice: Device;
  sendDevice: Device;
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
  recvMediaParams?: any;
  sendMediaParams?: any;
  mediaPermissionsToken: string | null;
}

export class MediaService extends Service<MediaData> {
  getInitialState() {
    return {
      recvDevice: new Device({ handlerName: detectDevice() }),
      sendDevice: new Device({ handlerName: detectDevice() }),
      audioStreams: {},
      videoStreams: {},
      sendTransport: null,
      mediaPermissionsToken: null,
      audioEnabled: false,
      videoEnabled: false,
      recvTransport: null,
    };
  }

  async initSendMedia({
    token,
    role,
    streamMediaImmediately,
    sendMediaParams,
  }: {
    token: string;
    role: Roles;
    streamMediaImmediately: boolean;
    sendMediaParams: boolean;
  }) {
    if (role === "viewer") {
      throw new Error("User cannot send media");
    }

    if (role === "speaker") {
      return this.stream({
        token,
        kind: "audio",
        streamMediaImmediately,
        sendMediaParams,
      });
    } else {
      return {
        ...(await this.stream({
          token,
          kind: "audio",
          streamMediaImmediately,
          sendMediaParams,
        })),
        ...(await this.stream({
          token,
          kind: "video",
          streamMediaImmediately,
          sendMediaParams,
        })),
      };
    }
  }

  /**
   * Applies header fixes and initializes mediasoup device
   * */
  private async loadSendDevice(routerRtpCapabilities: any) {
    //Fix orientation issue during recording
    routerRtpCapabilities.headerExtensions =
      routerRtpCapabilities.headerExtensions.filter(
        (ext: { uri: string }) => ext.uri !== "urn:3gpp:video-orientation"
      );

    await this.get().sendDevice.load({ routerRtpCapabilities });
  }

  /**
   * Returns existing send transport.
   * If it doesn't exist, creates a new one
   * */
  private async getSendTransport(sendTransportOptions: any) {
    const { mediaClient, stream, sendDevice } = this.get();

    let sendTransport = this.get().sendTransport;

    if (!sendTransport) {
      sendTransport = await mediaClient!.createTransport({
        roomId: stream!,
        device: sendDevice,
        direction: "send",
        options: {
          sendTransportOptions,
        },
        isProducer: true,
      });

      this.set({ sendTransport });
    }

    return sendTransport;
  }

  async stream({
    token,
    kind,
    streamMediaImmediately,
    sendMediaParams,
  }: {
    token: string;
    kind: MediaKind;
    streamMediaImmediately: boolean;
    sendMediaParams: any;
  }) {
    const { mediaClient, sendDevice } = this.get();

    if (!mediaClient) {
      throw new Error("media client is null");
    }

    const { routerRtpCapabilities, sendTransportOptions } = sendMediaParams;

    if (!sendDevice.loaded) {
      await this.loadSendDevice(routerRtpCapabilities);
    }

    mediaClient.permissionsToken = token;
    mediaClient.sendDevice = sendDevice;

    const sendTransport = await this.getSendTransport(sendTransportOptions);

    let media = this.get()[kind];

    if (!media) {
      await this.requestMediaStream(kind, {
        enabled: !!streamMediaImmediately,
      });

      media = this.get()[kind];
    }

    const producer = await mediaClient.sendMediaStream(
      media!.track,
      kind,
      sendTransport as Transport
    );

    return this.set({
      [kind]: {
        ...this.get()[kind],
        producer,
      },
    });
  }

  switchCamera() {
    (this.get().video?.track as any)._switchCamera();
  }

  async toggleVideo() {
    const { api, stream, video, videoEnabled } = this.get();

    if (stream) {
      await api.stream.toggleMedia({ videoEnabled: !videoEnabled });
    }

    video?.stream
      .getVideoTracks()
      .forEach((video: any) => (video.enabled = !videoEnabled));

    return this.set({
      videoEnabled: !videoEnabled,
    });
  }

  async toggleAudio() {
    const { api, stream, audio, audioEnabled } = this.get();

    if (stream) {
      await api.stream.toggleMedia({ audioEnabled });
    }

    audio?.stream
      .getAudioTracks()
      .forEach((audio: any) => (audio.enabled = !audioEnabled));

    return this.set({
      audioEnabled: !audioEnabled,
    });
  }

  async toggleParticipantMedia(
    user: string,
    { video, audio }: { video?: boolean; audio?: boolean }
  ) {
    return this.set((state) => {
      if (video !== undefined && state.videoStreams[user]) {
        state.videoStreams[user] = {
          ...state.videoStreams[user],
          enabled: video,
        };
      }

      if (audio !== undefined && state.audioStreams[user]) {
        state.audioStreams[user] = {
          ...state.audioStreams[user],
          enabled: audio,
        };
      }
    });
  }

  async consumeRemoteStream({
    user,
    consumerParameters,
    startConsumingImmediately,
  }: {
    user: string;
    consumerParameters: any;
    startConsumingImmediately: boolean;
  }) {
    const { mediaClient, recvTransport } = this.get();

    if (!mediaClient || !recvTransport) {
      throw new Error("Not ready to receive media");
    }

    const consumer = await mediaClient.consumeRemoteStream(
      consumerParameters,
      user,
      recvTransport
    );

    const stream = new MediaStream([consumer.track]);

    const key = consumer.kind === "audio" ? "audioStreams" : "videoStreams";

    return this.set({
      [key]: {
        ...this.get()[key],
        [user]: {
          consumer,
          stream,
          enabled: startConsumingImmediately,
          //enabled: false,
        },
      },
    });
  }

  async initMediaConsumer({
    mediaPermissionsToken,
    stream,
    recvMediaParams,
  }: {
    mediaPermissionsToken: string;
    stream: string;
    recvMediaParams: any;
  }) {
    const { api, recvDevice, sendDevice } = this.get();

    if (!recvDevice.loaded) {
      await recvDevice.load({
        routerRtpCapabilities: recvMediaParams.routerRtpCapabilities,
      });
    }

    const mediaClient = new MediaClient(
      recvDevice,
      sendDevice,
      api,
      mediaPermissionsToken
    );

    const recvTransport = await mediaClient.createTransport({
      roomId: stream,
      device: recvDevice!,
      direction: "recv",
      options: {
        recvTransportOptions: recvMediaParams.recvTransportOptions,
      },
      isProducer: false,
    });

    return this.set({
      mediaClient,
      recvDevice,
      recvMediaParams,
      recvTransport,
    });
  }

  async consumeRemoteStreams({
    stream,
    mediaPermissionsToken,
    recvMediaParams,
    streamers,
  }: {
    stream: string;
    mediaPermissionsToken: string;
    recvMediaParams: any;
    streamers: Participant[];
  }) {
    await this.initMediaConsumer({
      mediaPermissionsToken,
      stream,
      recvMediaParams,
    });

    const { mediaClient, recvTransport } = this.get();

    if (!mediaClient || !recvTransport) {
      throw new Error("MediaClient or RecvTransport not initialized");
    }

    const consumers = await mediaClient.consumeRemoteStreams(
      stream,
      recvTransport
    );

    let videoStreams: MediaStreamMap = {};
    let audioStreams: MediaStreamMap = {};

    streamers.forEach((s: Participant) => {
      const audioConsumer = consumers.find(
        (c) => c.appData.user === s.id && c.kind === "audio"
      );

      const videoConsumer = consumers.find(
        (c) => c.appData.user === s.id && c.kind === "video"
      );

      if (s.videoEnabled && !videoConsumer) {
        console.warn(
          `streamer ${s.id} has video enabled but no consumer has been found`
        );
      }

      if (audioConsumer) {
        audioStreams[s.id] = {
          consumer: audioConsumer,
          stream: new MediaStream([audioConsumer.track]),
          enabled: !!s.audioEnabled,
        };
      }

      if (videoConsumer) {
        videoStreams[s.id] = {
          consumer: videoConsumer,
          stream: new MediaStream([videoConsumer.track]),
          enabled: !!s.videoEnabled,
        };
      }
    });

    console.log("video streqms", videoStreams);

    this.set({
      audioStreams: { ...this.get().audioStreams, ...audioStreams },
      videoStreams: { ...this.get().videoStreams, ...videoStreams },
    });
  }

  async requestMediaStream(kind: MediaKind, params?: { enabled?: boolean }) {
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
      throw new Error("getUserMedia has returned a boolean type");
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
      return this.set({
        videoEnabled: !!params?.enabled,
        video: {
          stream: mediaStream,
          track: mediaStream.getVideoTracks()[0],
        },
      });
    } else {
      return this.set({
        audioEnabled: !!params?.enabled,
        audio: {
          stream: mediaStream,
          track: mediaStream.getAudioTracks()[0],
        },
      });
    }
  }

  async close() {
    const { audio, video } = this.get();

    //TODO: track.stop / track.release?
    audio?.stream.release();
    video?.stream.release();

    this.set({
      audio: undefined,
      video: undefined,
      audioEnabled: false,
      videoEnabled: false,
    });
  }

  closeProducer(...args: MediaKind[]) {
    for (const kind in args) {
      (this.get() as any)[kind]?.producer?.close();

      this.set({
        [kind]: undefined,
      });
    }
  }
}
