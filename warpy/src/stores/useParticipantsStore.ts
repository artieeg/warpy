import {Participant} from '@app/models';
import create, {SetState} from 'zustand';

interface IParticipantsStore {
  stream: string | null;
  page: number;
  count: number;
  speakers: Participant[];
  viewers: Participant[];
  raisedHands: Participant[];
  set: SetState<IParticipantsStore>;
  addViewers: (viewers: Participant[], page: number) => void;
  addViewer: (viewer: Participant) => void;
  removeViewer: (id: string) => void;
  addSpeaker: (speaker: Participant) => void;
  makeSpeaker: (user: Participant) => void;
  raiseHand: (user: Participant) => void;
  removeParticipant: (user: string) => void;
}

export const useParticipantsStore = create<IParticipantsStore>(set => ({
  stream: null,
  page: -1,
  count: 0,
  speakers: [],
  viewers: [],
  set,
  raisedHands: [],
  removeParticipant: user => {
    set(state => ({
      viewers: state.viewers.filter(v => v.id !== user),
      speakers: state.viewers.filter(v => v.id !== user),
      raisedHands: state.viewers.filter(v => v.id !== user),
    }));
  },
  makeSpeaker: user => {
    set(state => ({
      viewers: state.viewers.filter(v => v.id !== user.id),
      speakers: [...state.speakers, user],
      raisedHands: state.viewers.filter(v => v.id !== user.id),
    }));
  },
  addSpeaker: user => {
    set(state => ({
      speakers: [...state.speakers, user],
    }));
  },
  raiseHand: user => {
    set(state => ({
      viewers: state.viewers.filter(viewer => viewer.id !== user.id),
      raisedHands: [...state.raisedHands, user],
    }));
  },
  addViewers: (viewers, page) =>
    set(state => ({
      page,
      viewers: [...state.viewers, ...viewers],
      count: state.count,
    })),
  addViewer: viewer => {
    set(state => ({
      viewers: [...state.viewers, viewer],
      count: state.count + 1,
    }));
  },
  removeViewer: id => {
    set(state => ({
      viewers: state.viewers.filter(viewer => viewer.id !== id),
      count: state.count - 1,
    }));
  },
}));
