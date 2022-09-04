import { AppServices, StoreDispatcherSlice } from "./types";

export interface AppActionDispatcher {
  dispatch: (action: (services: AppServices) => any) => Promise<void>;
}

export const createDispatcher: StoreDispatcherSlice<AppActionDispatcher> = (
  runner
) => ({
  async dispatch(action) {
    await action(runner.getServices());
  },
});
