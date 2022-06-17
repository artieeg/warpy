import { IStore } from "../../useStore";

import { MediaKind, Roles } from "@warpy/lib";
import { Transport } from "mediasoup-client/lib/types";
import { StateUpdate } from "../types";
import { container } from "../../container";
import { AppState } from "../AppState";

export interface MediaStreamer {
  initSendMedia: (params: {
    token: string;
    role: Roles;
    streamMediaImmediately: boolean;
    sendMediaParams: boolean;
  }) => Promise<StateUpdate>;

  stream: (params: {
    token: string;
    kind: MediaKind;
    streamMediaImmediately: boolean;
    sendMediaParams: boolean;
  }) => Promise<StateUpdate>;
}

export class MediaStreamerImpl implements MediaStreamer {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async initSendMedia({
    token,
    role,
    streamMediaImmediately,
    sendMediaParams,
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

  async stream({ token, kind, streamMediaImmediately, sendMediaParams }) {
    const { mediaClient, stream, sendDevice } = this.state.get();

    if (!mediaClient) {
      throw new Error("media client is null");
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

    let sendTransport = this.state.get().sendTransport;

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

    let media = this.state.get()[kind];
    let requestMediaStreamResult: Partial<StateUpdate> = {};

    if (!media) {
      requestMediaStreamResult = await this.requestMediaStream(kind, {
        enabled: !!streamMediaImmediately,
      });

      media = requestMediaStreamResult[kind];
    }

    stateUpdate = { ...stateUpdate, [kind]: media };

    const producer = await mediaClient.sendMediaStream(
      media!.track,
      kind,
      sendTransport as Transport
    );
    console.log("done", stateUpdate[kind], kind);

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
