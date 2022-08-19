import create, { GetState, SetState, UseStore } from "zustand";
import { container } from "./container";
import { AppActionRunner } from "./AppActionRunner";
import { AppActionDispatcher, createDispatcher } from "./dispatch";
import { Store } from "./app/Store";
import { createAPISlice } from "./APISlice";

type StoreConfig = {
  data?: Partial<Store>;
  dependencies?: typeof container;
};

interface ZustandStore extends Store, AppActionDispatcher {
  set: SetState<Store>;
  get: GetState<Store>;
}

export let runner: AppActionRunner;
let state: UseStore<ZustandStore>;

export const createNewStore = (config: StoreConfig) => {
  if (config.dependencies) {
    const { mediaDevices, openStream, saveReaction } = config.dependencies;

    container.mediaDevices = mediaDevices;
    container.openStream = openStream;
    container.saveReaction = saveReaction;
  }

  state = create<ZustandStore>((set, get): ZustandStore => {
    runner = new AppActionRunner(set, get);

    const initialState = runner.initServices();

    return {
      ...config.data,
      ...createAPISlice(set, get),
      ...createDispatcher(runner, runner.getServices()),
      ...initialState,
      set,
      get,
    };
  });

  runner.connectServicesToStore(state);

  return state;
};
