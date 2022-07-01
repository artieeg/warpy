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
    sendMediaParams: any;
  }) => Promise<StateUpdate>;

  requestMediaStream: (
    kind: MediaKind,
    params?: { enabled?: boolean }
  ) => Promise<StateUpdate>;

  stream: (params: {
    token: string;
    kind: MediaKind;
    streamMediaImmediately: boolean;
    sendMediaParams: any;
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

    await this.state.get().sendDevice.load({ routerRtpCapabilities });
  }

  /**
   * Returns existing send transport.
   * If it doesn't exist, creates a new one
   * */
  private async getSendTransport(sendTransportOptions: any) {
    const { mediaClient, stream, sendDevice } = this.state.get();

    let sendTransport = this.state.get().sendTransport;

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

      this.state.update({ sendTransport });
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
    const { mediaClient, sendDevice } = this.state.get();

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

    let media = this.state.get()[kind];

    if (!media) {
      await this.requestMediaStream(kind, {
        enabled: !!streamMediaImmediately,
      });

      media = this.state.get()[kind];
    }

    const producer = await mediaClient.sendMediaStream(
      media!.track,
      kind,
      sendTransport as Transport
    );

    return this.state.update({
      [kind]: {
        ...this.state.get()[kind],
        producer,
      },
    });
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
      return this.state.update({
        videoEnabled: !!params?.enabled,
        video: {
          stream: mediaStream,
          track: mediaStream.getVideoTracks()[0],
        },
      });
    } else {
      return this.state.update({
        audioEnabled: !!params?.enabled,
        audio: {
          stream: mediaStream,
          track: mediaStream.getAudioTracks()[0],
        },
      });
    }
  }
}
