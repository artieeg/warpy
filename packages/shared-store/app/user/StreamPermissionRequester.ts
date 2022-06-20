import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StateUpdate } from "../types";

export interface StreamPermissionRequester {
  requestStreamPermission: () => StateUpdate;
}

export class StreamPermissionRequesterImpl
  implements StreamPermissionRequester
{
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  requestStreamPermission() {
    const { api, isRaisingHand } = this.state.get();

    if (isRaisingHand) {
      api.stream.lowerHand();
    } else {
      api.stream.raiseHand();
    }

    return this.state.update({
      isRaisingHand: !isRaisingHand,
    });
  }
}
