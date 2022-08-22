import { Store } from "./Store";
import { AppState } from "./AppState";
import { StateUpdate } from "./types";

type ManualStateUpdateCb = (update: StateUpdate) => void;

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

export abstract class ServiceWithInit<T> extends Service<T> {
  abstract init(manualStateUpdate: ManualStateUpdateCb): void;
}
