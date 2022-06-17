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
  private mediaService: MediaService;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }

    this.mediaService = new MediaService(this.state);
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

    this.state.update({
      stream,
      title,
      sendMediaParams,
      streamers: arrayToMap<IParticipant>([
        { ...user!, stream, role: "streamer", isBot: false, isBanned: false },
      ]),
      totalParticipantCount: count,
      currentStreamHost: user!.id,
      role: "streamer",
    });

    await this.mediaService.initMediaConsumer({
      mediaPermissionsToken,
      recvMediaParams,
    });

    await this.mediaService.stream({
      token: mediaPermissionsToken,
      kind: "audio",
      streamMediaImmediately: true,
      sendMediaParams,
    });

    await this.mediaService.stream({
      token: mediaPermissionsToken,
      kind: "video",
      streamMediaImmediately: true,
      sendMediaParams,
    });

    return this.state.getStateDiff();
  }
}
