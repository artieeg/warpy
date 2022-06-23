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

//TODO: reoganize participant state structure,
//after extracting logic from dispatchers, the code is a bit messy

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

    let updatedVideoStreams = { ...videoStreams };
    delete updatedVideoStreams[user];

    let updatedAudioStreams = { ...audioStreams };
    delete updatedAudioStreams[user];

    return this.state.update({
      videoStreams: updatedVideoStreams,
      audioStreams: updatedAudioStreams,
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

    let updatedViewers = { ...viewers };
    let updatedStreamers = { ...streamers };
    let updatedViewersWithRaisedHand = { ...viewersWithRaisedHands };

    delete updatedViewers[user];
    delete updatedStreamers[user];
    delete updatedViewersWithRaisedHand[user];

    return this.state.update({
      totalParticipantCount: totalParticipantCount - 1,
      streamers: updatedStreamers,
      viewers: updatedViewers,
      viewersWithRaisedHands: updatedViewersWithRaisedHand,
    });
  }

  addStreamParticipant(participant: IParticipant) {
    const {
      viewers,
      viewersWithRaisedHands,
      streamers,
      totalParticipantCount,
    } = this.state.get();

    //check if new
    if (
      !viewers[participant.id] &&
      !streamers[participant.id] &&
      !viewersWithRaisedHands[participant.id]
    ) {
      this.state.update({
        totalParticipantCount: totalParticipantCount + 1,
      });
    }

    let updatedViewers = { ...viewers };
    let updatedStreamers = { ...streamers };
    let updatedViewersWithRaisedHand = { ...viewersWithRaisedHands };

    if (participant.role === "viewer") {
      updatedViewers[participant.id] = participant;
      delete updatedStreamers[participant.id];
    } else if (
      participant.role === "streamer" ||
      participant.role === "speaker"
    ) {
      delete updatedViewers[participant.id];
      delete updatedViewersWithRaisedHand[participant.id];
      updatedStreamers[participant.id] = participant;
    }

    return this.state.update({
      streamers: updatedStreamers,
      viewers: updatedViewers,
      viewersWithRaisedHands: updatedViewersWithRaisedHand,
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
