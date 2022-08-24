import { useCallback, useMemo } from "react";
import { StateSelector } from "zustand";
import { createNewStore, Store } from "@warpy/store";
import shallow from "zustand/shallow";

import createContext from "zustand/context";
const Context = createContext<Store>();

export const useStore = Context.useStore;
export const useStoreApi = Context.useStoreApi;

export const StoreProvider = ({ children, data }: any) => {
  return (
    <Context.Provider createStore={() => createHydratedStore(data)}>
      {children}
    </Context.Provider>
  );
};

export function useStoreShallow<U>(selector: StateSelector<Store, U>) {
  return useStore(useCallback(selector, []), shallow);
}

let store: any;

export const createHydratedStore = (values: Partial<Store>) => {
  if (store) {
    return store;
  }

  store = createNewStore({
    dependencies: {
      mediaDevices: navigator.mediaDevices,
    },
    data: values,
  });

  store
    .getState()
    .connect("ws://localhost:9999/ws")
    .then(async () => {
      store.getState().createAPISubscriptions({
        onStreamIdAvailable: () => {},
      });

      const { access } = await store.getState().api.user.createAnonUser();
      console.log("created anon user", access);
      const data = await store.getState().api.user.auth(access);
      console.log("authed", data);
    });

  return store;
};
