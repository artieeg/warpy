import { useCallback, useMemo } from "react";
import { StateSelector } from "zustand";
import { createNewStore, IStore } from "@warpy/store";
import shallow from "zustand/shallow";

//export const StoreContext = createContext(null);

/*
export function useStore<U>(
  selector?: StateSelector<IStore, U>,
  eqFn?: any
): U {
  const store = useContext(StoreContext);
  const values = store(selector, eqFn);

  return values;
}
 */

import createContext from "zustand/context";
const Context = createContext<IStore>();

export const useStore = Context.useStore;
export const useStoreApi = Context.useStoreApi;

export const StoreProvider = ({ children, data }: any) => {
  return (
    <Context.Provider
      createStore={() => {
        if (typeof window !== "undefined") {
          return createHydratedStore(data);
        } else {
          return null;
        }
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useStoreShallow<U>(selector: StateSelector<IStore, U>) {
  return useStore(useCallback(selector, []), shallow);
}

let store: any;

export const createHydratedStore = (values: Partial<IStore>) => {
  console.log("typeof window", typeof window);
  if (typeof window === "undefined") {
    return;
  }

  const result = useMemo(() => {
    let _store =
      store ??
      createNewStore({
        dependencies: {
          mediaDevices: navigator.mediaDevices,
        },
        data: values,
      });

    if (!store) {
      _store
        .getState()
        .connect("ws://localhost:9999/ws")
        .then(async () => {
          _store.getState().createAPISubscriptions({
            onStreamIdAvailable: () => {},
          });

          const { access } = await _store.getState().api.user.createAnonUser();
          console.log("created anon user", access);
          await _store.getState().api.user.auth(access);
        });
    }

    if (values && store) {
      _store = createNewStore({
        dependencies: {
          mediaDevices: navigator.mediaDevices,
        },
        data: {
          ...store.getState(),
          ...values,
        },
      });

      store = undefined;
    }

    if (typeof window === "undefined") return _store;
    if (!store) store = _store;

    return _store;
  }, [values]);

  return result;
};
