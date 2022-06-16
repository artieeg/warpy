import { MediaStreamer, MediaStreamerImpl } from "./MediaStreamer";
import { MediaConsumer, MediaConsumerImpl } from "./MediaConsumer";
import { IStore } from "../../useStore";

export class MediaService implements MediaStreamer, MediaConsumer {
  streamer: MediaStreamer;
  consumer: MediaConsumer;

  constructor(state: IStore) {
    this.streamer = new MediaStreamerImpl(state);
    this.consumer = new MediaConsumerImpl(state);
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
