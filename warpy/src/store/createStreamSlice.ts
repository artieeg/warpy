import {Participant} from '@app/models';
import {GetState, SetState} from 'zustand';
import produce from 'immer';
import {Transport} from 'mediasoup-client/lib/Transport';
import {IStore} from './useStore';

export interface IStreamSlice {
  /** Stores current stream id */
  stream?: string;

  /** Stores latest fetched viewers page*/
  latestViewersPage: number;

  /**
   * Initialized after joining.
   * Updates once a new user joins or leaves the stream
   * */
  totalParticipantCount: number;

  /**
   * Stores audio/video streaming permissions
   * */
  mediaPermissionsToken: string | null;

  /**
   * Mediasoup recv params
   */
  recvMediaParams?: any;
  sendMediaParams?: any;

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

  setupAPIListeners: () => void;
  setCount: (newCount: number) => any;
  fetchMoreViewers: () => Promise<void>;
  addViewers: (viewers: Participant[], page: number) => void;
  addViewer: (viewer: Participant) => void;
  addSpeaker: (speaker: Participant) => void;
  addSpeakers: (speakers: Participant[]) => void;
  setActiveSpeaker: (speaker: Participant) => void;
  raiseHand: (user: Participant) => void;
  removeParticipant: (user: string) => void;
}

export const createStreamSlice = (
  set: SetState<IStore>,
  get: GetState<IStore>,
): IStreamSlice => ({
  latestViewersPage: -1,
  isFetchingViewers: false,
  totalParticipantCount: 0,
  mediaPermissionsToken: null,
  viewers: {},
  viewersWithRaisedHands: {},
  speakers: {},

  async create(title, hub, media, recvTransport) {
    const {api} = get();

    const {
      stream,
      media: mediaData,
      speakers: receivedSpeakers,
      count,
      mediaPermissionsToken,
      recvMediaParams,
    } = await api.stream.create(title, hub);

    const speakers: Record<string, Participant> = {};
    receivedSpeakers.forEach(speaker => {
      speakers[speaker.id] = Participant.fromJSON(speaker);
    });

    api.media.onNewTrack(data => {
      media.consumeRemoteStream(
        data.consumerParameters,
        data.user,
        recvTransport,
      );
    });

    set({
      mediaPermissionsToken,
      stream,
      speakers,
      totalParticipantCount: count,
      recvMediaParams,
      sendMediaParams: mediaData,
    });
  },

  async join(stream) {
    const {api} = get();

    const data = await api.stream.join(stream);

    const {
      mediaPermissionsToken,
      recvMediaParams,
      speakers,
      raisedHands,
      count,
    } = data;

    const fetchedSpeakers: Record<string, Participant> = {};
    speakers.forEach(speaker => {
      fetchedSpeakers[speaker.id] = Participant.fromJSON(speaker);
    });

    const fetchedRaisedHands: Record<string, Participant> = {};
    raisedHands.forEach(viewer => {
      fetchedRaisedHands[viewer.id] = Participant.fromJSON(viewer);
    });

    set({
      totalParticipantCount: count,
      mediaPermissionsToken,
      recvMediaParams,
      speakers: fetchedSpeakers,
      viewersWithRaisedHands: fetchedRaisedHands,
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

  setupAPIListeners() {
    const store = get();
    const {api} = store;

    api.stream.onNewViewer(data => {
      store.addViewer(data.viewer);
    });

    api.stream.onActiveSpeaker(data => {
      store.setActiveSpeaker(Participant.fromJSON(data.speaker as any));
    });

    api.stream.onNewRaisedHand(data => {
      const participant = Participant.fromJSON(data.viewer);
      participant.isRaisingHand = true;

      store.raiseHand(participant);
    });

    api.stream.onNewSpeaker(data => {
      const {speaker} = data;

      store.addSpeaker(speaker);
    });

    api.stream.onUserLeft(data => {
      const {user} = data;

      store.removeParticipant(user);
    });
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

  setActiveSpeaker(user) {
    set(
      produce<IStreamSlice>(state => {
        state.speakers[user.id] = {
          ...user,
          volume: 100 - Math.abs(user.volume),
        };
        console.log(state.speakers);
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
