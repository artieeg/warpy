import { StreamService } from "../app/stream";
import { StoreSlice } from "../types";
import { runner } from "../useStore";

export interface IAudioLevelDispatchers {
  dispatchAudioLevelsUpdate: (
    levels: { user: string; volume: number }[]
  ) => void;
  dispatchAudioLevelDelete: (user: string) => void;
}

export const createAudioLevelDispatchers: StoreSlice<IAudioLevelDispatchers> = (
  _set,
  get
) => ({
  dispatchAudioLevelsUpdate(levels) {
    runner.mergeStateUpdate(new StreamService(get()).updateAudioLevels(levels));
  },
  dispatchAudioLevelDelete(user) {
    runner.mergeStateUpdate(new StreamService(get()).delAudioLevel(user));
  },
});
