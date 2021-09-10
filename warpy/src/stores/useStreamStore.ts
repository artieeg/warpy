import {Participant} from '@app/models';
import create, {SetState} from 'zustand';
import produce from 'immer';
import {useAPIStore} from './useAPIStore';

interface IStreamStore {
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

  create: (title: string, hub: string) => Promise<void>;
  join: (id: string) => Promise<void>;

  setupAPIListeners: () => void;
  setCount: (newCount: number) => any;
  set: SetState<IStreamStore>;
  fetchMoreViewers: () => Promise<void>;
  addViewers: (viewers: Participant[], page: number) => void;
  addViewer: (viewer: Participant) => void;
  addSpeaker: (speaker: Participant) => void;
  addSpeakers: (speakers: Participant[]) => void;
  setActiveSpeaker: (speaker: Participant) => void;
  raiseHand: (user: Participant) => void;
  removeParticipant: (user: string) => void;
}

export const useStreamStore = create<IStreamStore>((set, get) => ({
  latestViewersPage: -1,
  isFetchingViewers: false,
  totalParticipantCount: 0,
  mediaPermissionsToken: null,
  viewers: {},
  viewersWithRaisedHands: {},
  speakers: {},

  set,

  async create(title, hub) {
    const {api} = useAPIStore.getState();

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
    const {api} = useAPIStore.getState();

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

    const {api} = useAPIStore.getState();
    const {latestViewersPage: page, stream} = get();

    if (!stream) {
      return;
    }

    const {viewers} = await api.stream.getViewers(stream, page + 1);

    set(
      produce<IStreamStore>(state => {
        state.isFetchingViewers = false;
        viewers.forEach(
          viewer => (state.viewers[viewer.id] = Participant.fromJSON(viewer)),
        );
      }),
    );
  },

  setupAPIListeners() {
    const {api} = useAPIStore.getState();

    const store = get();

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
      produce<IStreamStore>(state => {
        state.totalParticipantCount--;

        delete state.viewers[user];
        delete state.viewersWithRaisedHands[user];
        delete state.speakers[user];
      }),
    );
  },

  setActiveSpeaker(user) {
    set(
      produce<IStreamStore>(state => {
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
      produce<IStreamStore>(state => {
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
      produce<IStreamStore>(state => {
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
      produce<IStreamStore>(state => {
        viewers.forEach(viewer => {
          state.viewers[viewer.id] = Participant.fromJSON(viewer);
        });

        state.latestViewersPage = page;
      }),
    );
  },

  addViewer(viewer) {
    set(
      produce<IStreamStore>(state => {
        state.totalParticipantCount++;
        state.viewers[viewer.id] = Participant.fromJSON(viewer);
      }),
    );
  },
}));
