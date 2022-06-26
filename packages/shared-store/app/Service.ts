import { IStore } from "../useStore";
import { AppState } from "./AppState";

export class Service {
  protected state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  setState(state: IStore) {
    this.state.set(state);
  }
}
