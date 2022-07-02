import { IParticipant, MediaKind } from "@warpy/lib";
import { MediaClient } from "@warpy/media";
import { container } from "../../container";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { MediaStreamMap, StateUpdate } from "../types";

export interface MediaConsumer {
  initMediaConsumer: (params: {
    mediaPermissionsToken: string;
    stream: string;
    recvMediaParams: any;
  }) => Promise<StateUpdate>;
  consumeRemoteStreams: (params: {
    stream: string;
    mediaPermissionsToken: string;
    recvMediaParams: any;
    streamers: IParticipant[];
  }) => Promise<StateUpdate>;
  consumeRemoteStream: (params: {
    user: string;
    consumerParameters: any;
    startConsumingImmediately: boolean;
  }) => Promise<StateUpdate>;
}

export class MediaConsumerImpl implements MediaConsumer {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
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
    const { mediaClient, recvTransport } = this.state.get();

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

    return this.state.update({
      [key]: {
        ...this.state.get()[key],
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
    const { api, recvDevice, sendDevice } = this.state.get();

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

    return this.state.update({
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
    streamers: IParticipant[];
  }): Promise<StateUpdate> {
    await this.initMediaConsumer({
      mediaPermissionsToken,
      stream,
      recvMediaParams,
    });

    const { mediaClient, recvTransport } = this.state.get();

    if (!mediaClient || !recvTransport) {
      throw new Error("MediaClient or RecvTransport not initialized");
    }

    const consumers = await mediaClient.consumeRemoteStreams(
      stream,
      recvTransport
    );

    let videoStreams: MediaStreamMap = {};
    let audioStreams: MediaStreamMap = {};

    console.log("streamers", streamers);

    streamers.forEach((s: IParticipant) => {
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

    this.state.update({
      audioStreams: { ...this.state.get().audioStreams, ...audioStreams },
      videoStreams: { ...this.state.get().videoStreams, ...videoStreams },
    });

    return this.state.getStateDiff();
  }

  async requestMediaStream(
    kind: MediaKind,
    params?: { enabled?: boolean }
  ): Promise<StateUpdate> {
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
      return {
        videoEnabled: !!params?.enabled,
        video: {
          stream: mediaStream,
          track: mediaStream.getVideoTracks()[0],
        },
      };
    } else {
      return {
        audioEnabled: !!params?.enabled,
        audio: {
          stream: mediaStream,
          track: mediaStream.getAudioTracks()[0],
        },
      };
    }
  }
}
