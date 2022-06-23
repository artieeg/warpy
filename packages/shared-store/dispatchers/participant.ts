import { IParticipant } from "@warpy/lib";
import produce from "immer";
import { StreamService } from "../app/stream";
import { StoreSlice } from "../types";
import { IStore, runner } from "../useStore";

export interface IParticipantDispatchers {
  dispatchViewersFetch: () => Promise<void>;
  dispatchParticipantAdd: (viewer: IParticipant) => void;
  dispatchStreamerAdd: (streamer: IParticipant) => void;
  dispatchParticipantRaisedHand: (user: IParticipant) => void;
  dispatchParticipantRemove: (user: string) => void;
  dispatchMediaToggle: (
    user: string,
    data: { video?: boolean; audio?: boolean }
  ) => void;
}

export const createParticipantDispatchers: StoreSlice<IParticipantDispatchers> =
  (set, get) => ({
    dispatchStreamerAdd(user) {
      runner.mergeStateUpdate(
        new StreamService(get()).addStreamParticipant(user)
      );
    },

    async dispatchViewersFetch() {
      await runner.mergeStreamedUpdates(
        new StreamService(get()).fetchStreamViewers()
      );
    },

    dispatchParticipantRemove(user) {
      runner.mergeStateUpdate(
        new StreamService(get()).removeStreamParticipant(user)
      );
    },

    dispatchParticipantRaisedHand(user) {
      runner.mergeStateUpdate(
        new StreamService(get()).updateStreamParticipant(user)
      );
    },

    dispatchParticipantAdd(user) {
      runner.mergeStateUpdate(
        new StreamService(get()).addStreamParticipant(user)
      );
    },

    dispatchMediaToggle(user, { video, audio }) {
      set(
        produce<IStore>((state) => {
          if (video !== undefined && state.videoStreams[user]) {
            state.videoStreams[user].enabled = video;
          }

          if (audio !== undefined && state.audioStreams[user]) {
            state.audioStreams[user].enabled = audio;
          }
        })
      );
    },
  });
