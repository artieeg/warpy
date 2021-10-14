import {Participant} from '@app/models';
import {GetState, SetState} from 'zustand';
import produce from 'immer';
import {Transport} from 'mediasoup-client/lib/Transport';
import {IStore} from '../useStore';
import {arrayToMap} from '@app/utils';
import {Roles} from '@warpy/lib';

export interface IStreamSlice {
  /** Stores current stream id */
  stream: string | null;
  title: string | null;

  role: Roles | null;

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

  viewers: Record<string, Participant>;
  viewersWithRaisedHands: Record<string, Participant>;
  speakers: Record<string, Participant>;

  create: (
    title: string,
    hub: string,
    media: any,
    recvTransport?: Transport,
  ) => Promise<void>;
  join: (id: string) => Promise<void>;

  setCount: (newCount: number) => any;
  fetchMoreViewers: () => Promise<void>;
  addViewers: (viewers: Participant[], page: number) => void;
  addViewer: (viewer: Participant) => void;
  addSpeaker: (speaker: Participant) => void;
  addSpeakers: (speakers: Participant[]) => void;
  raiseHand: (user: Participant) => void;
  removeParticipant: (user: string) => void;
}

export const createStreamSlice = (
  set: SetState<IStore>,
  get: GetState<IStore>,
): IStreamSlice => ({
  stream: null,
  role: null,
  isSpeaker: false,
  latestViewersPage: -1,
  isFetchingViewers: false,
  totalParticipantCount: 0,
  viewers: {},
  viewersWithRaisedHands: {},
  isStreamOwner: false,
  speakers: {},
  title: null,

  async create(title, hub) {
    const {api, sendMedia, initViewerMedia} = get();

    const {
      stream,
      media: mediaData,
      speakers,
      count,
      mediaPermissionsToken,
      recvMediaParams,
    } = await api.stream.create(title, hub);

    /*
    //TODO: move to the API slice
    await api.media.onNewTrack(data => {
      mediaClient.consumeRemoteStream(
        data.consumerParameters,
        data.user,
        recvTransport,
      );
    });
    */

    set({
      stream,
      title,
      speakers: arrayToMap<Participant>(speakers.map(Participant.fromJSON)),
      totalParticipantCount: count,
      isStreamOwner: true,
      role: 'streamer',
    });

    await initViewerMedia(mediaPermissionsToken, recvMediaParams);
    await sendMedia(mediaPermissionsToken, mediaData, ['audio', 'video']);
  },

  async join(stream) {
    const {api, initViewerMedia} = get();

    const {
      mediaPermissionsToken,
      recvMediaParams,
      speakers,
      raisedHands,
      count,
    } = await api.stream.join(stream);

    await initViewerMedia(mediaPermissionsToken, recvMediaParams);

    set({
      stream,
      totalParticipantCount: count,
      speakers: arrayToMap<Participant>(speakers.map(Participant.fromJSON)),
      viewersWithRaisedHands: arrayToMap<Participant>(
        raisedHands.map(Participant.fromJSON),
      ),
      role: 'viewer',
    });
  },

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
        viewers.forEach(
          viewer => (state.viewers[viewer.id] = Participant.fromJSON(viewer)),
        );
      }),
    );
  },

  setCount(newCount) {
    set(() => ({totalParticipantCount: newCount}));
  },

  removeParticipant(user) {
    set(
      produce<IStreamSlice>(state => {
        state.totalParticipantCount--;

        delete state.viewers[user];
        delete state.viewersWithRaisedHands[user];
        delete state.speakers[user];
      }),
    );
  },

  addSpeaker(user) {
    set(
      produce<IStreamSlice>(state => {
        delete state.viewers[user.id];
        delete state.viewersWithRaisedHands[user.id];
        state.speakers[user.id] = {...user, volume: 0};
      }),
    );
  },

  addSpeakers(speakers) {
    set(() => {
      speakers;
    });
  },

  raiseHand(user) {
    set(
      produce<IStreamSlice>(state => {
        delete state.viewers[user.id];
        state.viewersWithRaisedHands[user.id] = {
          ...user,
          isRaisingHand: true,
        };
      }),
    );
  },

  addViewers(viewers, page) {
    set(
      produce<IStreamSlice>(state => {
        viewers.forEach(viewer => {
          state.viewers[viewer.id] = Participant.fromJSON(viewer);
        });

        state.latestViewersPage = page;
      }),
    );
  },

  addViewer(viewer) {
    set(
      produce<IStreamSlice>(state => {
        state.totalParticipantCount++;
        state.viewers[viewer.id] = Participant.fromJSON(viewer);
      }),
    );
  },
});
