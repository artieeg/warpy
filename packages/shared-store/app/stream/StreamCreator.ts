import { IParticipant, Roles } from "@warpy/lib";
import { arrayToMap } from "../../dispatchers";
import { IStore } from "../../useStore";
import { MediaService } from "../media";
import { StateUpdate } from "../types";

export interface StreamCreator {
  create: () => Promise<StateUpdate>;
}

export class StreamCreatorImpl implements StreamCreator {
  constructor(private state: IStore) {}

  async create() {
    const { newStreamCategory, api, title, user } = this.state;

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

    const consumer = new MediaService(this.state);

    const mediaConsumerResult = await consumer.initMediaConsumer({
      mediaPermissionsToken,
      recvMediaParams,
    });

    const audioStreamer = new MediaService({
      ...this.state,
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
      ...this.state,
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

    //await dispatchMediaSend(mediaPermissionsToken, ["audio", "video"], true);
  }
}
