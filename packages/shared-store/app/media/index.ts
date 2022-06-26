import { MediaStreamer, MediaStreamerImpl } from "./MediaStreamer";
import { MediaConsumer, MediaConsumerImpl } from "./MediaConsumer";
import { MediaCleaner, MediaCleanerImpl } from "./MediaCleaner";
import { MediaManager, MediaManagerImpl } from "./MediaManager";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { IParticipant, MediaKind, Roles } from "@warpy/lib";
import { Service } from "../Service";

export class MediaService
  extends Service
  implements MediaStreamer, MediaConsumer, MediaCleaner, MediaManager
{
  private streamer: MediaStreamer;
  private consumer: MediaConsumer;
  private cleaner: MediaCleaner;
  private manager: MediaManager;

  constructor(state: IStore | AppState) {
    super(state);
    this.streamer = new MediaStreamerImpl(this.state);
    this.consumer = new MediaConsumerImpl(this.state);
    this.cleaner = new MediaCleanerImpl(this.state);
    this.manager = new MediaManagerImpl(this.state);
  }

  toggleVideo() {
    return this.manager.toggleVideo();
  }

  toggleAudio() {
    return this.manager.toggleAudio();
  }

  switchCamera() {
    return this.manager.switchCamera();
  }

  requestMediaStream(kind: MediaKind, params?: { enabled?: boolean }) {
    return this.streamer.requestMediaStream(kind, params);
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

  consumeRemoteStream(params: { user: string; consumerParameters: any }) {
    return this.consumer.consumeRemoteStream(params);
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

  async toggleParticipantMedia(
    user: string,
    { video, audio }: { video: boolean; audio: boolean }
  ) {
    return this.manager.toggleParticipantMedia(user, { video, audio });
  }
}
