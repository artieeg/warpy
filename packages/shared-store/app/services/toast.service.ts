import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { Service } from "../Service";

export type TOAST_DURATION = "LONG" | "SHORT";

export class ToastService extends Service {
  constructor(state: IStore | AppState) {
    super(state);
  }

  async showToastMessage(message: string, duration: TOAST_DURATION = "SHORT") {
    return this.state.update({
      message,
      duration,
    });
  }
}
