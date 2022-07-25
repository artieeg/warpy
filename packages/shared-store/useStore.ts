import create, { UseStore } from "zustand";
import { container } from "./container";
import { AppActionRunner } from "./AppActionRunner";
import { createDispatcher } from "./dispatch";
import { IStore } from "./app/Store";
import { createAPISlice } from "./slices/createAPISlice";

interface Selectors<StoreType> {
  use: {
    [key in keyof StoreType]: () => StoreType[key];
  };
}

type StoreConfig = {
  data?: Partial<IStore>;
  dependencies?: typeof container;
};

export let runner: AppActionRunner;
let state: UseStore<IStore>;

export const createNewStore = (config: StoreConfig) => {
  if (config.dependencies) {
    const { mediaDevices, openStream, saveReaction } = config.dependencies;

    container.mediaDevices = mediaDevices;
    container.openStream = openStream;
    container.saveReaction = saveReaction;
  }

  state = create<IStore>((set, get): IStore => {
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
