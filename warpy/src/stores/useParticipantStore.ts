import {Participant} from '@app/models';
import create, {SetState} from 'zustand';
import produce from 'immer';
import {useAPIStore} from './useAPIStore';

interface IParticipantStore {
  stream: string | null;
  page: number;
  count: number;
  loading: boolean;

  viewers: Record<string, Participant>;
  viewersWithRaisedHands: Record<string, Participant>;
  speakers: Record<string, Participant>;

  setupAPIListeners: () => void;
  setCount: (newCount: number) => any;
  set: SetState<IParticipantStore>;
  fetchMoreViewers: () => Promise<void>;
  addViewers: (viewers: Participant[], page: number) => void;
  addViewer: (viewer: Participant) => void;
  addSpeaker: (speaker: Participant) => void;
  addSpeakers: (speakers: Participant[]) => void;
  setActiveSpeaker: (speaker: Participant, isSpeaking: boolean) => void;
  raiseHand: (user: Participant) => void;
  removeParticipant: (user: string) => void;
}

export const useParticipantStore = create<IParticipantStore>((set, get) => ({
  stream: null,
  page: -1,
  loading: false,
  count: 0,
  viewers: {},
  viewersWithRaisedHands: {},
  speakers: {},

  set,
  fetchMoreViewers: async () => {
    set({loading: true});

    const {api} = useAPIStore.getState();
    const {page, stream} = get();

    if (!stream) {
      return;
    }

    const {viewers} = await api.stream.getViewers(stream, page + 1);

    set(
      produce<IParticipantStore>(state => {
        state.loading = false;
        viewers.forEach(
          viewer => (state.viewers[viewer.id] = Participant.fromJSON(viewer)),
        );
      }),
    );
  },
  setupAPIListeners: () => {
    const {api} = useAPIStore.getState();

    const store = get();

    api.stream.onNewViewer(data => {
      store.addViewer(data.viewer);
    });

    api.stream.onActiveSpeaker(data => {
      store.setActiveSpeaker(Participant.fromJSON(data.speaker), true);
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
  setCount: newCount => set(() => ({count: newCount})),
  removeParticipant: user => {
    set(
      produce<IParticipantStore>(state => {
        state.count--;

        delete state.viewers[user];
        delete state.viewersWithRaisedHands[user];
        delete state.speakers[user];
      }),
    );
  },
  setActiveSpeaker: user => {
    set(
      produce<IParticipantStore>(state => {
        const speaker = state.speakers[user.id];

        if (speaker) {
          speaker.volume = 100 - Math.abs(user.volume);
        }
      }),
    );
  },
  addSpeaker: user => {
    set(
      produce<IParticipantStore>(state => {
        delete state.viewers[user.id];
        delete state.viewersWithRaisedHands[user.id];
        state.speakers[user.id] = {...user, volume: 0};
      }),
    );
  },
  addSpeakers: speakers => {
    set(() => {
      speakers;
    });
  },
  raiseHand: user => {
    set(
      produce<IParticipantStore>(state => {
        delete state.viewers[user.id];
        state.viewersWithRaisedHands[user.id] = {
          ...user,
          isRaisingHand: true,
        };
      }),
    );
  },
  addViewers: (viewers, page) =>
    set(
      produce<IParticipantStore>(state => {
        viewers.forEach(viewer => {
          state.viewers[viewer.id] = Participant.fromJSON(viewer);
        });

        state.page = page;
      }),
    ),
  addViewer: viewer => {
    set(
      produce<IParticipantStore>(state => {
        state.count++;
        state.viewers[viewer.id] = Participant.fromJSON(viewer);
      }),
    );
  },
}));
