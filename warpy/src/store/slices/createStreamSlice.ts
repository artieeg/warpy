import {GetState, SetState} from 'zustand';
import produce from 'immer';
import {IStore} from '../useStore';
import {IParticipant, Roles} from '@warpy/lib';
import {IParticipantWithMedia} from '@app/types';

export interface IStreamSlice {
  /** Stores current stream id */
  stream: string | null;
  title: string | null;

  isSpeaker: boolean | null;
  isStreamOwner: boolean;

  /** Stores latest fetched viewers page*/
  latestViewersPage: number;

  /**
   * Initialized after joining.
   * Updates once a new user joins or leaves the stream
   * */
  totalParticipantCount: number;

  isFetchingViewers: boolean;

  /** Stream viewers */
  consumers: Record<string, IParticipantWithMedia>;

  /** Users sending audio/video streams */
  producers: Record<string, IParticipantWithMedia>;

  viewersWithRaisedHands: Record<string, IParticipant>;

  fetchMoreViewers: () => Promise<void>;
  addViewer: (viewer: IParticipant) => void;
  setProducer: (speaker: IParticipant) => void;
  addProducers: (speakers: IParticipant[]) => void;
  raiseHand: (user: IParticipant) => void;
  removeParticipant: (user: string) => void;
}

export const createStreamSlice = (
  set: SetState<IStore>,
  get: GetState<IStore>,
): IStreamSlice => ({
  stream: null,
  isSpeaker: false,
  latestViewersPage: -1,
  isFetchingViewers: false,
  totalParticipantCount: 0,
  viewersWithRaisedHands: {},
  isStreamOwner: false,

  /** Audio/video streamers */
  producers: {},

  consumers: {},

  title: null,

  async fetchMoreViewers() {
    set({isFetchingViewers: true});

    const {api} = get();
    const {latestViewersPage: page, stream} = get();

    if (!stream) {
      return;
    }

    const {viewers} = await api.stream.getViewers(stream, page + 1);

    set(
      produce<IStreamSlice>(state => {
        state.isFetchingViewers = false;
        viewers.forEach(viewer => (state.consumers[viewer.id] = viewer));
      }),
    );
  },

  removeParticipant(user) {
    set(
      produce<IStreamSlice>(state => {
        state.totalParticipantCount--;

        delete state.consumers[user];
        delete state.viewersWithRaisedHands[user];
        delete state.producers[user];
      }),
    );
  },

  setProducer(user) {
    set(
      produce<IStreamSlice>(state => {
        delete state.consumers[user.id];
        delete state.viewersWithRaisedHands[user.id];

        state.producers[user.id] = user;
      }),
    );
  },

  addProducers(speakers) {
    set(() => {
      speakers;
    });
  },

  raiseHand(user) {
    set(
      produce<IStreamSlice>(state => {
        delete state.consumers[user.id];
        state.viewersWithRaisedHands[user.id] = {
          ...user,
          isRaisingHand: true,
        };
      }),
    );
  },

  addViewer(viewer) {
    set(
      produce<IStreamSlice>(state => {
        state.totalParticipantCount++;
        state.consumers[viewer.id] = viewer;
      }),
    );
  },
});
