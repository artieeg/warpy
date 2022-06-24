import { AppState } from "../AppState";
import { StateUpdate } from "../types";
import { IStore } from "../../useStore";

export type AudioLevelRecord = {
  user: string;
  volume: number;
};

export interface AudioLevelsUpdater {
  updateAudioLevels: (levels: AudioLevelRecord[]) => StateUpdate;
  delAudioLevel: (user: string) => StateUpdate;
}

export class AudioLevelsUpdaterImpl implements AudioLevelsUpdater {
  private state: AppState;

  constructor(state: AppState | IStore) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  updateAudioLevels(levels: AudioLevelRecord[]) {
    return this.state.update((state) => {
      levels.forEach(({ user, volume }) => {
        state.userAudioLevels[user] = volume;
      });
    });
  }

  delAudioLevel(user: string) {
    return this.state.update((state) => {
      delete state.userAudioLevels[user];
    });
  }
}
