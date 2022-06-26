import { StoreDispatcherSlice } from "../types";

export interface IAudioLevelDispatchers {
  dispatchAudioLevelsUpdate: (
    levels: { user: string; volume: number }[]
  ) => void;
  dispatchAudioLevelDelete: (user: string) => void;
}

export const createAudioLevelDispatchers: StoreDispatcherSlice<IAudioLevelDispatchers> =
  (runner, { stream }) => ({
    dispatchAudioLevelsUpdate(levels) {
      runner.mergeStateUpdate(stream.updateAudioLevels(levels));
    },
    dispatchAudioLevelDelete(user) {
      runner.mergeStateUpdate(stream.delAudioLevel(user));
    },
  });
