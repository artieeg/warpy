import { TOAST_DURATION } from "../app/toast";
import { StoreDispatcherSlice } from "../types";

export interface IToastDispatchers {
  dispatchToastMessage: (message: string, duration?: TOAST_DURATION) => void;
}

export const createToastDispatchers: StoreDispatcherSlice<IToastDispatchers> = (
  runner,
  { toast }
) => ({
  dispatchToastMessage(message, duration) {
    runner.mergeStateUpdate(toast.showToastMessage(message, duration));
  },
});
