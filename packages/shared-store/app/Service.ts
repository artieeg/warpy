import { IStore } from "../useStore";
import { AppState } from "./AppState";

export abstract class Service<T> {
  protected state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  abstract getInitialState(): Partial<T>;

  setState(state: IStore) {
    this.state.set(state);
  }
}
