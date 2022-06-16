import { IParticipant, MediaKind, Roles } from "@warpy/lib";
import { MediaClient } from "@warpy/media";
import { Transport } from "mediasoup-client/lib/types";
import { container } from "../container";
import { IStore } from "../useStore";
import { MediaStreamMap, StateUpdate } from "./types";

export const getMediaService = (state: IStore) => {
  return {
    async initSendMedia({
      token,
      role,
      streamMediaImmediately,
    }: {
      token: string;
      role: Roles;
      streamMediaImmediately: boolean;
    }): Promise<StateUpdate> {
      if (role === "viewer") {
        throw new Error("User cannot send media");
      }

      if (role === "speaker") {
        return this.stream(token, "audio", streamMediaImmediately);
      } else {
        return {
          ...(await this.stream(token, "audio", streamMediaImmediately)),
          ...(await this.stream(token, "video", streamMediaImmediately)),
        };
      }
    },

    async stream(
      token: string,
      kind: MediaKind,
      streamMediaImmediately: boolean
    ) {
      const { mediaClient, stream, sendMediaParams, sendDevice } = state;

      if (!mediaClient) {
        throw new Error();
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

      mediaClient.permissionsToken = token;
      mediaClient.sendDevice = sendDevice;

      let stateUpdate: StateUpdate = {};

      let sendTransport = state.sendTransport;

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

        stateUpdate.sendTransport = sendTransport;
      }

      let media = state[kind];
      let requestMediaStreamResult: Partial<StateUpdate> = {};

      if (!media) {
        requestMediaStreamResult = await this.requestMediaStream(kind, {
          enabled: !!streamMediaImmediately,
        });

        media = requestMediaStreamResult[kind];
      }

      const producer = await mediaClient.sendMediaStream(
        media!.track,
        kind,
        sendTransport as Transport
      );

      stateUpdate[kind]!.producer = producer;

      return { ...stateUpdate, ...requestMediaStreamResult };
    },

    async initRecvMedia({
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
      const { api, recvDevice, sendDevice } = state;

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
        device: recvDevice,
        direction: "recv",
        options: {
          recvTransportOptions: recvMediaParams.recvTransportOptions,
        },
        isProducer: false,
      });

      const consumers = await mediaClient.consumeRemoteStreams(
        stream,
        recvTransport
      );

      let videoStreams: MediaStreamMap = {};
      let audioStreams: MediaStreamMap = {};

      streamers.forEach((s) => {
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
        mediaClient,
        recvMediaParams,
        recvTransport,
        audioStreams: { ...state.audioStreams, ...audioStreams },
        videoStreams: { ...state.videoStreams, ...videoStreams },
      };
    },

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
    },
  };
};
