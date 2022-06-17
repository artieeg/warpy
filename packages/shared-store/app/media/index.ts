import { MediaStreamer, MediaStreamerImpl } from "./MediaStreamer";
import { MediaConsumer, MediaConsumerImpl } from "./MediaConsumer";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";

export class MediaService implements MediaStreamer, MediaConsumer {
  streamer: MediaStreamer;
  consumer: MediaConsumer;

  constructor(state: IStore | AppState) {
    this.streamer = new MediaStreamerImpl(state);
    this.consumer = new MediaConsumerImpl(state);
  }

  initMediaConsumer(params) {
    return this.consumer.initMediaConsumer(params);
  }

  consumeRemoteStreams(params) {
    return this.consumer.consumeRemoteStreams(params);
  }

  stream(params) {
    return this.streamer.stream(params);
  }

  initSendMedia(params) {
    return this.streamer.initSendMedia(params);
  }
}
