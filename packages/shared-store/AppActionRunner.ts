import { PartialState, SetState } from "zustand";
import { StateUpdate, StreamedStateUpdate } from "./app/types";
import { IStore } from "./useStore";

/**
 * Applies received state updates to zustand store
 *
 * Actions usually produce a single state update,
 * those are handled by mergeStateUpdate(...).
 *
 * However, some actions may produce multiple state updates
 * (toggling on and off loading indicator during api request, etc.)
 * for this kind of actions, mergeStreamedUpdates(...) is used
 *
 * */
export class AppActionRunner {
  constructor(private set: SetState<IStore>) {}

  private async merge(stateUpdate: StateUpdate | Promise<StateUpdate>) {
    const update = await stateUpdate;

    return update as PartialState<IStore>;
  }

  /**
   * Apply a singular state update
   * */
  async mergeStateUpdate(update: StateUpdate | Promise<StateUpdate>) {
    const r = await this.merge(update);

    this.set(r);
    console.log("setting");
  }

  /**
   * Apply multiple state updates received from AsyncGenerator
   * */
  async mergeStreamedUpdates(update: StreamedStateUpdate) {
    let { done, value } = await update.next();

    while (!done) {
      this.set(await this.merge(value));

      const result = await update.next();
      done = result.done;
      value = result.value;
    }

    this.set(await this.merge(value));
  }
}
