import { AppServices, StoreDispatcherSlice } from "./types";

export type Dispatch = (
  action: (services: AppServices) => any
) => Promise<void>;

export interface AppActionDispatcher {
  dispatch: Dispatch;
}

export const createDispatcher: StoreDispatcherSlice<AppActionDispatcher> = (
  runner
) => ({
  async dispatch(action) {
    await action(runner.getServices());
  },
});
