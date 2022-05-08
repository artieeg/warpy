import { IParticipant } from "@warpy/lib";
import produce from "immer";
import { StoreSlice } from "../types";
import { IStore } from "../useStore";

export interface IParticipantDispatchers {
  dispatchViewersFetch: () => Promise<void>;
  dispatchParticipantAdd: (viewer: IParticipant) => void;
  dispatchStreamerAdd: (streamer: IParticipant) => void;
  dispatchStreamers: (streamers: IParticipant[]) => void;
  dispatchParticipantRaisedHand: (user: IParticipant) => void;
  dispatchParticipantRemove: (user: string) => void;
  dispatchMediaToggle: (
    user: string,
    data: { video?: boolean; audio?: boolean }
  ) => void;
}

export const createParticipantDispatchers: StoreSlice<IParticipantDispatchers> =
  (set, get) => ({
    async dispatchViewersFetch() {
      set({ isFetchingViewers: true });

      const { api } = get();
      const { latestViewersPage: page, stream } = get();

      if (!stream) {
        return;
      }

      const { viewers } = await api.stream.getViewers(stream, page + 1);

      set(
        produce<IStore>((state) => {
          state.isFetchingViewers = false;
          viewers.forEach((viewer) => (state.viewers[viewer.id] = viewer));
        })
      );
    },

    dispatchParticipantRemove(user) {
      set(
        produce<IStore>((state) => {
          state.totalParticipantCount--;

          const video = state.videoStreams[user];
          const audio = state.audioStreams[user];

          if (video) {
            video.consumer.close();
            delete state.videoStreams[user];
          }

          if (audio) {
            audio.consumer.close();
            delete state.audioStreams[user];
          }

          delete state.viewers[user];
          delete state.viewersWithRaisedHands[user];
          delete state.streamers[user];
        })
      );
    },

    dispatchStreamerAdd(user) {
      set(
        produce<IStore>((state) => {
          delete state.viewers[user.id];
          delete state.viewersWithRaisedHands[user.id];

          state.streamers[user.id] = user;
        })
      );
    },

    dispatchStreamers(speakers) {
      set(() => {
        speakers;
      });
    },

    dispatchParticipantRaisedHand(user) {
      set(
        produce<IStore>((state) => {
          if (user.isRaisingHand) {
            delete state.viewers[user.id];
            state.viewersWithRaisedHands[user.id] = user;

            if (state.modalCurrent !== "participants") {
              state.unseenRaisedHands++;
            }
          } else {
            state.viewers[user.id] = user;
            delete state.viewersWithRaisedHands[user.id];

            if (
              state.modalCurrent !== "participants" &&
              state.unseenRaisedHands > 0
            ) {
              state.unseenRaisedHands--;
            }
          }
        })
      );
    },

    dispatchParticipantAdd(user) {
      set(
        produce<IStore>((state) => {
          state.totalParticipantCount++;
          if (user.role === "viewer") {
            state.viewers[user.id] = user;
          } else if (user.role === "streamer" || user.role === "speaker") {
            state.streamers[user.id] = user;
          }
        })
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
