import produce from 'immer';
import {StoreSlice} from '../types';

export interface IActiveSpeakerSlice {
  activeSpeakers: Record<string, number>;

  setActiveSpeaker: (speaker: string, volume: number) => void;
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
  setActiveSpeaker: (speaker, volume) => {
    set(
      produce(state => {
        state.activeSpeakers[speaker] = volume;
      }),
    );
  },
});
