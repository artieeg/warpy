import produce from 'immer';
import {StoreSlice} from '../types';
import {IStore} from '../useStore';

export interface IAudioLevelDispatchers {
  dispatchAudioLevelsUpdate: (
    speakers: {user: string; volume: number}[],
  ) => void;
  dispatchAudioLevelDelete: (speaker: string) => void;
}

export const createAudioLevelDispatchers: StoreSlice<IAudioLevelDispatchers> = (
  set,
  _get,
) => ({
  dispatchAudioLevelsUpdate(speakers) {
    set(
      produce<IStore>(state => {
        speakers.forEach(({user, volume}) => {
          state.userAudioLevels[user] = volume;
        });
      }),
    );
  },
  dispatchAudioLevelDelete(speaker) {
    set(
      produce(state => {
        delete state.userAudioLevels[speaker];
      }),
    );
  },
});
