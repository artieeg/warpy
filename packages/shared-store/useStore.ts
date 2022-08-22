import create, { UseStore } from "zustand";
import { container } from "./container";
import { AppActionRunner } from "./AppActionRunner";
import { createDispatcher } from "./dispatch";
import { Store } from "./app/Store";
import { createAPISlice } from "./APISlice";
import { ZustandStore } from "./ZustandStore";

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
      ...createAPISlice(set, get),
      ...createDispatcher(runner, runner.getServices()),
      set,
      get,
    };
  });

  runner.connectServicesToStore(state as any);

  return state;
};
