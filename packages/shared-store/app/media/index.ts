import { MediaStreamer, MediaStreamerImpl } from "./MediaStreamer";
import { MediaConsumer, MediaConsumerImpl } from "./MediaConsumer";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { IParticipant, MediaKind, Roles } from "@warpy/lib";

export class MediaService implements MediaStreamer, MediaConsumer {
  streamer: MediaStreamer;
  consumer: MediaConsumer;

  constructor(state: IStore | AppState) {
    this.streamer = new MediaStreamerImpl(state);
    this.consumer = new MediaConsumerImpl(state);
  }

  initMediaConsumer(params: {
    mediaPermissionsToken: string;
    stream: string;
    recvMediaParams: any;
  }) {
    return this.consumer.initMediaConsumer(params);
  }

  consumeRemoteStreams(params: {
    stream: string;
    mediaPermissionsToken: string;
    recvMediaParams: any;
    streamers: IParticipant[];
  }) {
    return this.consumer.consumeRemoteStreams(params);
  }

  stream(params: {
    token: string;
    kind: MediaKind;
    streamMediaImmediately: boolean;
    sendMediaParams: any;
  }) {
    return this.streamer.stream(params);
  }

  initSendMedia(params: {
    token: string;
    role: Roles;
    streamMediaImmediately: boolean;
    sendMediaParams: any;
  }) {
    return this.streamer.initSendMedia(params);
  }
}
