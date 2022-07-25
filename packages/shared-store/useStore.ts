import create, { UseStore } from "zustand";
import { container } from "./container";
import { AppActionRunner } from "./AppActionRunner";
import { createDispatcher } from "./dispatch";
import { Store } from "./app/Store";
import { createAPISlice } from "./slices/createAPISlice";

interface Selectors<StoreType> {
  use: {
    [key in keyof StoreType]: () => StoreType[key];
  };
}

type StoreConfig = {
  data?: Partial<Store>;
  dependencies?: typeof container;
};

export let runner: AppActionRunner;
let state: UseStore<Store>;

export const createNewStore = (config: StoreConfig) => {
  if (config.dependencies) {
    const { mediaDevices, openStream, saveReaction } = config.dependencies;

    container.mediaDevices = mediaDevices;
    container.openStream = openStream;
    container.saveReaction = saveReaction;
  }

  state = create<Store>((set, get): Store => {
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
