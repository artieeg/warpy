import { IParticipant } from "@warpy/lib";
import { arrayToMap } from "../../dispatchers";
import { IStore } from "../../useStore";
import { MediaService } from "../media";
import { StateUpdate } from "../types";
import { AppState } from "../AppState";

export interface StreamCreator {
  create: () => Promise<StateUpdate>;
}

export class StreamCreatorImpl implements StreamCreator {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async create() {
    const { newStreamCategory, api, title, user } = this.state.get();

    if (!title || !newStreamCategory) {
      throw new Error("title or category");
    }

    const {
      stream,
      media: sendMediaParams,
      count,
      mediaPermissionsToken,
      recvMediaParams,
    } = await api.stream.create(title, newStreamCategory.id);

    this.state.update({ stream });

    const consumer = new MediaService(this.state.get());

    const mediaConsumerResult = await consumer.initMediaConsumer({
      mediaPermissionsToken,
      recvMediaParams,
    });

    const audioStreamer = new MediaService({
      ...this.state.get(),
      stream,
      mediaClient: mediaConsumerResult.mediaClient,
    });

    const audioStreamResult = await audioStreamer.stream({
      token: mediaPermissionsToken,
      kind: "audio",
      streamMediaImmediately: true,
      sendMediaParams,
    });

    const videoStreamer = new MediaService({
      ...this.state.get(),
      stream,
      mediaClient: mediaConsumerResult.mediaClient,
      sendTransport: audioStreamResult.sendTransport!,
    });

    const videoStreamResult = await videoStreamer.stream({
      token: mediaPermissionsToken,
      kind: "video",
      streamMediaImmediately: true,
      sendMediaParams,
    });

    return {
      ...audioStreamResult,
      ...videoStreamResult,
      ...mediaConsumerResult,
      stream,
      title,
      sendMediaParams,
      streamers: arrayToMap<IParticipant>([
        { ...user!, stream, role: "streamer", isBot: false, isBanned: false },
      ]),
      totalParticipantCount: count,
      currentStreamHost: user!.id,
      role: "streamer",
    } as StateUpdate;
  }
}
