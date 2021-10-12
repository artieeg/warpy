import produce from 'immer';
import {StoreSlice} from '../types';

export interface IActiveSpeakerSlice {
  activeSpeakers: Record<string, number>;

  setActiveSpeakers: (speaker: {user: string; volume: number}[]) => void;
  deleteActiveSpeaker: (speaker: string) => void;
}

export const createActiveSpeakerSlice: StoreSlice<IActiveSpeakerSlice> = (
  set,
): IActiveSpeakerSlice => ({
  activeSpeakers: {},
  deleteActiveSpeaker: speaker => {
    set(
      produce(state => {
        delete state.activeSpeakers[speaker];
      }),
    );
  },
  setActiveSpeakers: speakers => {
    set(
      produce(state => {
        speakers.forEach(({user, volume}) => {
          state.activeSpeakers[user] = volume;
        });
      }),
    );
  },
});
