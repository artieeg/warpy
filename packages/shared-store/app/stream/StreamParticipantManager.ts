import { IParticipant } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StateUpdate, StreamedStateUpdate } from "../types";

export interface StreamParticipantManager {
  fetchStreamViewers: () => StreamedStateUpdate;
  addStreamParticipant: (viewer: IParticipant) => Promise<StateUpdate>;
  removeStreamParticipant: (user: string) => Promise<StateUpdate>;
  updateStreamParticipant: (user: IParticipant) => Promise<StateUpdate>;
}

export class StreamParticipantManagerImpl implements StreamParticipantManager {
  private state: AppState;

  constructor(state: AppState | IStore) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  private mergeNewViewers(newViewers: IParticipant[]) {
    const oldViewers = this.state.get().viewers;

    const updatedViewers = { ...oldViewers };

    newViewers.forEach((viewer) => {
      updatedViewers[viewer.id] = viewer;
    });

    return updatedViewers;
  }

  async *fetchStreamViewers() {
    yield this.state.update({
      isFetchingViewers: true,
    });

    const { api, latestViewersPage: page, stream } = this.state.get();

    if (!stream) {
      return;
    }

    const { viewers } = await api.stream.getViewers(stream, page + 1);

    yield this.state.update({
      isFetchingViewers: false,
      viewers: this.mergeNewViewers(viewers),
    });
  }

  private clearMediaFrom(user: string) {
    const { videoStreams, audioStreams } = this.state.get();

    const video = videoStreams[user];
    const audio = audioStreams[user];

    if (video) {
      video.consumer.close();
    }

    if (audio) {
      audio.consumer.close();
    }

    return this.state.update({
      videoStreams: {
        ...videoStreams,
        [user]: undefined,
      },
      audioStreams: {
        ...audioStreams,
        [user]: undefined,
      },
    });
  }

  async removeStreamParticipant(user: string) {
    const {
      totalParticipantCount,
      viewers,
      viewersWithRaisedHands,
      streamers,
    } = this.state.get();

    this.clearMediaFrom(user);

    return this.state.update({
      totalParticipantCount: totalParticipantCount - 1,
      viewers: {
        ...viewers,
        [user]: undefined,
      },
      viewersWithRaisedHands: {
        ...viewersWithRaisedHands,
        [user]: undefined,
      },
      streamers: {
        ...streamers,
        [user]: undefined,
      },
    });
  }

  async addStreamParticipant(user: IParticipant) {
    const { viewers, streamers, totalParticipantCount } = this.state.get();

    this.state.update({
      totalParticipantCount: totalParticipantCount + 1,
    });

    if (user.role === "viewer") {
      return this.state.update({
        viewers: {
          ...viewers,
          [user.id]: user,
        },
      });
    } else if (user.role === "streamer" || user.role === "speaker") {
      return this.state.update({
        streamers: {
          ...streamers,
          [user.id]: user,
        },
      });
    }
  }

  private hasStreamingRequestStatusChanged(user: IParticipant) {
    const { viewersWithRaisedHands } = this.state.get();

    return (
      (user.isRaisingHand && !viewersWithRaisedHands[user.id]) ||
      (!user.isRaisingHand && !!viewersWithRaisedHands[user.id])
    );
  }

  private setStreamingRequestFor(user: IParticipant) {
    const { viewers, modalCurrent, unseenRaisedHands, viewersWithRaisedHands } =
      this.state.get();

    return this.state.update({
      viewers: {
        ...viewers,
        [user.id]: undefined,
      },
      viewersWithRaisedHands: {
        ...viewersWithRaisedHands,
        [user.id]: user,
      },
      unseenRaisedHands:
        modalCurrent !== "participants"
          ? unseenRaisedHands + 1
          : unseenRaisedHands,
    });
  }

  private cancelStreamingRequestFor(user: IParticipant) {
    const { viewers, modalCurrent, unseenRaisedHands, viewersWithRaisedHands } =
      this.state.get();

    return this.state.update({
      viewers: {
        ...viewers,
        [user.id]: user,
      },
      viewersWithRaisedHands: {
        ...viewersWithRaisedHands,
        [user.id]: undefined,
      },
      unseenRaisedHands:
        modalCurrent !== "participants" && unseenRaisedHands > 0
          ? unseenRaisedHands - 1
          : unseenRaisedHands,
    });
  }

  async updateStreamParticipant(user: IParticipant) {
    if (this.hasStreamingRequestStatusChanged(user)) {
      if (user.isRaisingHand) {
        this.setStreamingRequestFor(user);
      } else {
        this.cancelStreamingRequestFor(user);
      }
    }

    return this.state.getStateDiff();
  }
}
