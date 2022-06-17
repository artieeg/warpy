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

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async join({ stream }) {
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

    const mediaService = new MediaService(this.state);

    /** Consume remote audio/video streams */
    const consumeRemoteStreamsResult = await mediaService.consumeRemoteStreams({
      stream,
      mediaPermissionsToken,
      recvMediaParams,
      streamers,
    });

    /** If not viewer, start sending media */
    let initSendMediaResult: StateUpdate = {};
    if (role !== "viewer") {
      initSendMediaResult = await mediaService.initSendMedia({
        token: mediaPermissionsToken,
        role,
        streamMediaImmediately: false,
        sendMediaParams,
      });
    }

    return {
      ...initSendMediaResult,
      ...consumeRemoteStreamsResult,
      stream,
      currentStreamHost: host,
      totalParticipantCount: count,
      streamers: arrayToMap<IParticipant>(streamers),
      viewersWithRaisedHands: arrayToMap<IParticipant>(raisedHands),
      role,
    };
  }
}
