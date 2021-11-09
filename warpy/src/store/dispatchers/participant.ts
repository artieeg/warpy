import {IParticipant} from '@warpy/lib';
import produce from 'immer';
import {StoreSlice} from '../types';
import {IStore} from '../useStore';

export interface IParticipantDispatchers {
  dispatchViewersFetch: () => Promise<void>;
  dispatchParticipantAdd: (viewer: IParticipant) => void;
  dispatchStreamerAdd: (streamer: IParticipant) => void;
  dispatchStreamers: (streamers: IParticipant[]) => void;
  dispatchParticipantRaisedHand: (user: IParticipant) => void;
  dispatchParticipantRemove: (user: string) => void;
  dispatchMediaToggle: (
    user: string,
    data: {video?: boolean; audio?: boolean},
  ) => void;
}

export const createParticipantDispatchers: StoreSlice<IParticipantDispatchers> =
  (set, get) => ({
    async dispatchViewersFetch() {
      set({isFetchingViewers: true});

      const {api} = get();
      const {latestViewersPage: page, stream} = get();

      if (!stream) {
        return;
      }

      const {viewers} = await api.stream.getViewers(stream, page + 1);

      set(
        produce<IStore>(state => {
          state.isFetchingViewers = false;
          viewers.forEach(viewer => (state.viewers[viewer.id] = viewer));
        }),
      );
    },

    dispatchParticipantRemove(user) {
      set(
        produce<IStore>(state => {
          state.totalParticipantCount--;

          delete state.viewers[user];
          delete state.viewersWithRaisedHands[user];
          delete state.streamers[user];
        }),
      );
    },

    dispatchStreamerAdd(user) {
      set(
        produce<IStore>(state => {
          delete state.viewers[user.id];
          delete state.viewersWithRaisedHands[user.id];

          state.streamers[user.id] = user;
        }),
      );
    },

    dispatchStreamers(speakers) {
      set(() => {
        speakers;
      });
    },

    dispatchParticipantRaisedHand(user) {
      set(
        produce<IStore>(state => {
          delete state.viewers[user.id];
          state.viewersWithRaisedHands[user.id] = {
            ...user,
            isRaisingHand: true,
          };
        }),
      );
    },

    dispatchParticipantAdd(user) {
      set(
        produce<IStore>(state => {
          state.totalParticipantCount++;
          if (user.role === 'viewer') {
            state.viewers[user.id] = user;
          } else if (user.role === 'streamer' || user.role === 'speaker') {
            state.streamers[user.id] = user;
          }
        }),
      );
    },

    dispatchMediaToggle(user, {video, audio}) {
      set(
        produce<IStore>(state => {
          const {media} = state.streamers[user];

          if (!media) {
            return;
          }

          if (video !== undefined && media.video) {
            state.streamers[user].media!.video!.active = video;
          }

          if (audio !== undefined && media.audio) {
            state.streamers[user].media!.audio!.active = audio;
          }
        }),
      );
    },
  });
