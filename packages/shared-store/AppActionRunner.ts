import produce from "immer";
import { SetState } from "zustand";
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

    return produce((state) => {
      for (const key in update) {
        state[key] = (update as any)[key];
      }
    });
  }

  /**
   * Apply a singular state update
   * */
  async mergeStateUpdate(update: Promise<StateUpdate>) {
    this.set(await this.merge(update));
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
  }
}
