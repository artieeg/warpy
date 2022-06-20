import { IStore } from "../../useStore";
import { AppState } from "../AppState";

export type TOAST_DURATION = "LONG" | "SHORT";

export class ToastService {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async showToastMessage(message: string, duration: TOAST_DURATION = "SHORT") {
    return this.state.update({
      message,
      duration,
    });
  }
}
