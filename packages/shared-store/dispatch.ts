import { StateUpdate, StreamedStateUpdate } from "./app/types";
import { AppServices, StoreDispatcherSlice } from "./types";

export interface AppActionDispatcher {
  dispatch: (
    action: (
      services: AppServices
    ) => StateUpdate | Promise<StateUpdate> | StreamedStateUpdate
  ) => Promise<void>;
}

const isStreamedUpdate = (update: object) => {
  return (
    Reflect.has(update, "next") &&
    Reflect.has(update, "return") &&
    Reflect.has(update, "throw")
  );
};

export const createDispatcher: StoreDispatcherSlice<AppActionDispatcher> = (
  runner
) => ({
  async dispatch(action) {
    const update = await action(runner.getServices());

    if (!update) {
      return;
      //throw new Error("Action has returned void");
    }

    if (isStreamedUpdate(update)) {
      await runner.mergeStreamedUpdates(update as StreamedStateUpdate);
    } else {
      await runner.mergeStateUpdate(
        update as StateUpdate | Promise<StateUpdate>
      );
    }
  },
});
