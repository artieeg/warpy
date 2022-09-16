import create, { UseStore } from "zustand";
import { AppActionRunner } from "./AppActionRunner";
import { Store, container } from "@warpy/client";
import { createAPISlice } from "./APISlice";
import { ZustandStore } from "./ZustandStore";
import { AppServices } from "./types";

type StoreConfig = {
  data?: Partial<Store>;
  dependencies?: typeof container;
};

export let runner: AppActionRunner;
let state: UseStore<ZustandStore>;

export const createNewStore = (config: StoreConfig) => {
  if (config.dependencies) {
    const { mediaDevices, openStream, saveReaction } = config.dependencies;

    container.mediaDevices = mediaDevices;
    container.openStream = openStream;
    container.saveReaction = saveReaction;
  }

  state = create<ZustandStore>((set: any, get: any): ZustandStore => {
    runner = new AppActionRunner(set, get);

    const initialState = runner.initServices();

    return {
      ...config.data,
      ...initialState,
      ...createAPISlice(
        set,
        get,
        async (action: (services: AppServices) => any) => {
          await action(runner.getServices());
        }
      ),
      set,
      get,
    };
  });

  return state;
};

export function useDispatcher() {
  return async (action: (services: AppServices) => any) => {
    await action(runner.getServices());
  };
}
