import { IStore } from "../useStore";
import { StateUpdate } from "./types";

/**
 * Stores state copy,
 * provides access to the state variables,
 * accumulates state updates,
 * returns the diff between the initial and final state
 * */
export class AppState {
  private diff: StateUpdate;
  private state: IStore;

  constructor(state: IStore) {
    this.state = { ...state };
    this.diff = {};
  }

  get() {
    return this.state;
  }

  update(update: Partial<IStore>) {
    this.state = { ...this.state, ...update };
    this.diff = { ...this.diff, ...update };
  }

  getStateDiff() {
    return this.diff;
  }
}
