import produce from "immer";
import { Store } from "./Store";
import { StateUpdate } from "./types";

/**
 * Stores state copy,
 * provides access to the state variables,
 * accumulates state updates,
 * returns the diff between the initial and final state
 * */
export class AppState {
  private diff: StateUpdate;
  private state: Store;

  constructor(state: Store) {
    this.state = { ...state };
    this.diff = {};
  }

  get() {
    return this.state;
  }

  set(state: Store) {
    this.state = { ...state };
    this.diff = {};
  }

  update(update: Partial<Store> | ((draft: Store) => void)) {
    if (typeof update === "object") {
      this.state = { ...this.state, ...update };
      this.diff = { ...this.diff, ...update };
    } else {
      this.state = produce(update)(this.state);
      this.diff = { ...this.state };
    }

    return this.getStateDiff();
  }

  getStateDiff() {
    return this.diff;
  }
}
