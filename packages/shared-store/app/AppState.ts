import produce from "immer";
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

  update(update: Partial<IStore> | ((draft: IStore) => void)) {
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
