import { IParticipant } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StateUpdate, StreamedStateUpdate } from "../types";

export interface StreamParticipantManager {
  fetchStreamViewers: () => StreamedStateUpdate;
  addStreamParticipant: (participant: IParticipant) => StateUpdate;
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

  async *fetchStreamViewers() {
    yield this.state.update({
      isFetchingViewers: true,
    });

    const { api, latestViewersPage: page, stream } = this.state.get();

    if (!stream) {
      return;
    }

    const { viewers } = await api.stream.getViewers(stream, page + 1);

    yield this.state.update((state) => {
      state.isFetchingViewers = false;
      for (const viewer of viewers) {
        state.viewers[viewer.id] = viewer;
      }
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

    return this.state.update((state) => {
      delete state.videoStreams[user];
      delete state.audioStreams[user];
    });
  }

  async removeStreamParticipant(user: string) {
    this.clearMediaFrom(user);

    return this.state.update((state) => {
      delete state.viewers[user];
      delete state.streamers[user];
      delete state.viewersWithRaisedHands[user];
      state.totalParticipantCount--;
    });
  }

  addStreamParticipant(participant: IParticipant) {
    return this.state.update((state) => {
      if (
        !state.viewers[participant.id] &&
        !state.streamers[participant.id] &&
        !state.viewersWithRaisedHands[participant.id]
      ) {
        state.totalParticipantCount++;
      }

      delete state.viewers[participant.id];
      delete state.viewersWithRaisedHands[participant.id];
      delete state.streamers[participant.id];

      if (participant.role === "viewer") {
        state.viewers[participant.id] = participant;
      } else {
        state.streamers[participant.id] = participant;
      }
    });
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

    let updatedViewers = { ...viewers };
    delete updatedViewers[user.id];

    return this.state.update({
      viewers: updatedViewers,
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

    let updatedViewersWithRaisedHand = { ...viewersWithRaisedHands };
    delete updatedViewersWithRaisedHand[user.id];

    return this.state.update({
      viewers: {
        ...viewers,
        [user.id]: user,
      },
      viewersWithRaisedHands: updatedViewersWithRaisedHand,
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
