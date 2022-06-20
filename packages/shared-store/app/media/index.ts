import { MediaStreamer, MediaStreamerImpl } from "./MediaStreamer";
import { MediaConsumer, MediaConsumerImpl } from "./MediaConsumer";
import { MediaCleaner, MediaCleanerImpl } from "./MediaCleaner";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { IParticipant, MediaKind, Roles } from "@warpy/lib";

export class MediaService
  implements MediaStreamer, MediaConsumer, MediaCleaner
{
  private streamer: MediaStreamer;
  private consumer: MediaConsumer;
  private cleaner: MediaCleaner;

  constructor(state: IStore | AppState) {
    this.streamer = new MediaStreamerImpl(state);
    this.consumer = new MediaConsumerImpl(state);
    this.cleaner = new MediaCleanerImpl(state);
  }

  initMediaConsumer(params: {
    mediaPermissionsToken: string;
    stream: string;
    recvMediaParams: any;
  }) {
    return this.consumer.initMediaConsumer(params);
  }

  close() {
    return this.cleaner.close();
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

  closeProducer(...args: MediaKind[]) {
    return this.cleaner.closeProducer(...args);
  }
}
