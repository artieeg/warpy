import { MediaService } from "../media";

import { IStore } from "../../useStore";
import { StateUpdate } from "../types";
import { IParticipant } from "@warpy/lib";
import { arrayToMap } from "../../dispatchers";
import { AppState } from "../AppState";

export interface StreamJoiner {
  join: ({ stream }: { stream: string }) => Promise<StateUpdate>;
}

export class StreamJoinerImpl implements StreamJoiner {
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

  async join({ stream }: { stream: string }) {
    const { api } = this.state.get();

    const {
      mediaPermissionsToken,
      recvMediaParams,
      streamers,
      raisedHands,
      count,
      host,
      role,
      sendMediaParams,
    } = await api.stream.join(stream);

    this.state.update({
      stream,
      currentStreamHost: host,
      totalParticipantCount: count,
      streamers: arrayToMap<IParticipant>(streamers),
      viewersWithRaisedHands: arrayToMap<IParticipant>(raisedHands),
      role,
    });

    /** Consume remote audio/video streams */
    await this.mediaService.consumeRemoteStreams({
      stream,
      mediaPermissionsToken,
      recvMediaParams,
      streamers,
    });

    /** If not viewer, start sending media */
    if (role !== "viewer") {
      await this.mediaService.initSendMedia({
        token: mediaPermissionsToken,
        role,
        streamMediaImmediately: false,
        sendMediaParams,
      });
    }

    return this.state.getStateDiff();
  }
}
