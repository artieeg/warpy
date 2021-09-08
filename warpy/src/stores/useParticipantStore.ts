import {Participant} from '@app/models';
import create, {SetState} from 'zustand';
import produce from 'immer';
import {useAPIStore} from './useAPIStore';
import {Alert} from 'react-native';

interface IParticipantsStore {
  stream: string | null;
  page: number;
  count: number;
  loading: boolean;
  participants: Participant[];

  setupAPIListeners: () => void;
  setCount: (newCount: number) => any;
  set: SetState<IParticipantsStore>;
  fetchMoreViewers: () => Promise<void>;
  addViewers: (viewers: Participant[], page: number) => void;
  addViewer: (viewer: Participant) => void;
  addSpeaker: (speaker: Participant) => void;
  setActiveSpeaker: (speaker: Participant, isSpeaking: boolean) => void;
  raiseHand: (user: Participant) => void;
  removeParticipant: (user: string) => void;
}

export const useParticipantStore = create<IParticipantsStore>((set, get) => ({
  stream: null,
  page: -1,
  loading: false,
  count: 0,
  participants: [],
  set,
  fetchMoreViewers: async () => {
    set({loading: true});

    const {api} = useAPIStore.getState();
    const {page, stream} = get();

    if (!stream) {
      return;
    }

    const {viewers} = await api.stream.getViewers(stream, page + 1);

    set(state => ({
      participants: [...state.participants, ...viewers],
      loading: false,
    }));
  },
  setupAPIListeners: () => {
    const {api} = useAPIStore.getState();

    const store = get();

    api.stream.onNewViewer(data => {
      store.addViewer(data.viewer);
    });

    api.stream.onActiveSpeaker(data => {
      Alert.alert('new active speaker', JSON.stringify(data));
      store.setActiveSpeaker(data.speaker, true);
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
    set(state => ({
      participants: state.participants.filter(v => v.id !== user),
      count: state.count - 1,
    }));
  },
  setActiveSpeaker: (user, isSpeaking) => {
    set(
      produce(state => {
        const participant = state.participants.find(
          (p: Participant) => p.id === user.id,
        );

        if (!participant) {
          state.participants.push(user);
        } else {
          participant.isSpeaking = isSpeaking;
        }
      }),
    );
  },
  addSpeaker: user => {
    set(
      produce(state => {
        const participant = state.participants.find(
          (p: Participant) => p.id === user.id,
        );

        if (!participant) {
          state.participants.push(user);
        } else {
          participant.role = 'speaker';
          participant.isRaisingHand = false;
        }
      }),
    );
  },
  raiseHand: user => {
    set(
      produce(state => {
        const participant = state.participants.find(
          (p: Participant) => p.id === user.id,
        );

        if (!participant) {
          state.participants.push(user);
        } else {
          participant.isRaisingHand = true;
        }
      }),
    );
  },
  addViewers: (viewers, page) =>
    set(state => ({
      page,
      participants: [...state.participants, ...viewers],
    })),
  addViewer: viewer => {
    set(state => ({
      participants: [...state.participants, viewer],
      count: state.count + 1,
    }));
  },
}));
