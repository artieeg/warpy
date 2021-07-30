import {Participant} from '@app/models';
import create, {SetState} from 'zustand';
import produce from 'immer';

interface IParticipantsStore {
  stream: string | null;
  page: number;
  count: number;
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
  removeParticipant: user => {
    set(state => ({
      participants: state.participants.filter(v => v.id !== user),
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
      count: state.count,
    })),
  addViewer: viewer => {
    set(state => ({
      participants: [...state.participants, viewer],
      count: state.count + 1,
    }));
  },
}));
