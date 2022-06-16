import produce from "immer";
import { StateUpdate } from "./app/types";

export const mergeStateUpdate = async (
  stateUpdate: StateUpdate | Promise<StateUpdate>
) => {
  const update = await stateUpdate;

  return produce((state) => {
    for (const key in update) {
      state[key] = (update as any)[key];
    }
  });
};
