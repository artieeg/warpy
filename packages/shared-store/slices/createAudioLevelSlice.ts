import {StoreSlice} from '../types';

export interface IAudioLevelSlice {
  userAudioLevels: Record<string, number>;
}

export const createAudioLevelSlice: StoreSlice<IAudioLevelSlice> =
  (): IAudioLevelSlice => ({
    userAudioLevels: {},
  });
