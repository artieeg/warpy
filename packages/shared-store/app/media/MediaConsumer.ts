import { IParticipant, MediaKind } from "@warpy/lib";
import { MediaClient } from "@warpy/media";
import { container } from "../../container";
import { IStore } from "../../useStore";
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
}

export class MediaConsumerImpl implements MediaConsumer {
  constructor(private state: IStore) {}

  async initMediaConsumer({ mediaPermissionsToken, stream, recvMediaParams }) {
    const { api, recvDevice, sendDevice } = this.state;

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

    return { mediaClient, recvDevice, recvMediaParams, recvTransport };
  }

  async consumeRemoteStreams({
    stream,
    mediaPermissionsToken,
    recvMediaParams,
    streamers,
  }): Promise<StateUpdate> {
    const initMediaConsumerResult = await this.initMediaConsumer({
      mediaPermissionsToken,
      stream,
      recvMediaParams,
    });

    const { mediaClient, recvTransport } = initMediaConsumerResult;

    const consumers = await mediaClient.consumeRemoteStreams(
      stream,
      recvTransport
    );

    let videoStreams: MediaStreamMap = {};
    let audioStreams: MediaStreamMap = {};

    streamers.forEach((s: IParticipant) => {
      const audioConsumer = consumers.find(
        (c) => c.appData.user === s.id && c.kind === "audio"
      );

      const videoConsumer = consumers.find(
        (c) => c.appData.user === s.id && c.kind === "video"
      );

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

    return {
      ...initMediaConsumerResult,
      recvMediaParams,
      recvTransport,
      audioStreams: { ...this.state.audioStreams, ...audioStreams },
      videoStreams: { ...this.state.videoStreams, ...videoStreams },
    };
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
