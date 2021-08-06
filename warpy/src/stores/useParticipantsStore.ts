import {Participant} from '@app/models';
import create, {SetState} from 'zustand';
import produce from 'immer';

interface IParticipantsStore {
  stream: string | null;
  page: number;
  count: number;
  setCount: (newCount: number) => any;
  incrementCount: () => any;
  decrementCount: () => any;
  participants: Participant[];
  set: SetState<IParticipantsStore>;
  addViewers: (viewers: Participant[], page: number) => void;
  addViewer: (viewer: Participant) => void;
  addSpeaker: (speaker: Participant) => void;
  raiseHand: (user: Participant) => void;
  removeParticipant: (user: string) => void;
}

export const useParticipantsStore = create<IParticipantsStore>(set => ({
  stream: null,
  page: -1,
  count: 0,
  participants: [],
  set,
  setCount: newCount => set(() => ({count: newCount})),
  incrementCount: () => set(state => ({count: state.count + 1})),
  decrementCount: () => set(state => ({count: state.count - 1})),
  removeParticipant: user => {
    set(state => ({
      participants: state.participants.filter(v => v.id !== user),
      count: state.count - 1,
    }));
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
