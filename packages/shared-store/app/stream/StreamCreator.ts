import { IParticipant } from "@warpy/lib";
import { IStore } from "../../useStore";
import { MediaService } from "../media";
import { StateUpdate } from "../types";
import { AppState } from "../AppState";

export interface StreamCreator {
  create: () => Promise<StateUpdate>;
  setNewStreamTitle: (title: string) => StateUpdate;
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

  setNewStreamTitle(title: string) {
    return this.state.update({
      title,
    });
  }

  async create() {
    const { newStreamCategory, api, title, user } = this.state.get();

    console.log({ newStreamCategory });

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
      streamers: {
        [user.id]: {
          ...user!,
          stream,
          role: "streamer",
          isBot: false,
          isBanned: false,
        },
      },
      totalParticipantCount: count,
      currentStreamHost: user!.id,
      role: "streamer",
    });

    await this.mediaService.initMediaConsumer({
      stream,
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
