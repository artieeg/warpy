import { ToastService, TOAST_DURATION } from "../app/toast";
import { StoreSlice } from "../types";
import { runner } from "../useStore";

export interface IToastDispatchers {
  dispatchToastMessage: (message: string, duration?: TOAST_DURATION) => void;
}

export const createToastDispatchers: StoreSlice<IToastDispatchers> = (
  _set,
  get
) => ({
  dispatchToastMessage(message, duration) {
    runner.mergeStateUpdate(
      new ToastService(get()).showToastMessage(message, duration)
    );
  },
});
