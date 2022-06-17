import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StateUpdate } from "../types";

export interface MediaCleaner {
  close: () => Promise<StateUpdate>;
}

export class MediaCleanerImpl implements MediaCleaner {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState({ ...state });
    }
  }

  async close() {
    const { audio, video } = this.state.get();

    //TODO: track.stop / track.release?
    audio?.stream.release();
    video?.stream.release();

    this.state.update({
      audio: undefined,
      video: undefined,
      audioEnabled: false,
      videoEnabled: false,
    });

    return this.state.getStateDiff();
  }
}
