import { Store } from "./Store";
import { AppState } from "./AppState";

export abstract class Service<T> {
  protected state: AppState;

  constructor(state: Store | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  abstract getInitialState(): Partial<T>;

  setState(state: Store) {
    this.state.set(state);
  }
}
