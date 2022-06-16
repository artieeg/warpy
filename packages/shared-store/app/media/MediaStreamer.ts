import { IStore } from "../../useStore";

import { MediaKind, Roles } from "@warpy/lib";
import { Transport } from "mediasoup-client/lib/types";
import { StateUpdate } from "../types";
import { container } from "../../container";

export interface MediaStreamer {
  initSendMedia: (params: {
    token: string;
    role: Roles;
    streamMediaImmediately: boolean;
  }) => Promise<StateUpdate>;

  stream: ({
    token: string,
    kind: MediaKind,
    streamMediaImmediately: boolean,
  }) => Promise<StateUpdate>;
}

export class MediaStreamerImpl implements MediaStreamer {
  constructor(private state: IStore) {}

  async initSendMedia({ token, role, streamMediaImmediately }) {
    if (role === "viewer") {
      throw new Error("User cannot send media");
    }

    if (role === "speaker") {
      return this.stream({ token, kind: "audio", streamMediaImmediately });
    } else {
      return {
        ...(await this.stream({
          token,
          kind: "audio",
          streamMediaImmediately,
        })),
        ...(await this.stream({
          token,
          kind: "video",
          streamMediaImmediately,
        })),
      };
    }
  }

  async stream({ token, kind, streamMediaImmediately }) {
    const { mediaClient, stream, sendMediaParams, sendDevice } = this.state;

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

    let sendTransport = this.state.sendTransport;

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

    let media = this.state[kind];
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
  }

  private async requestMediaStream(
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
