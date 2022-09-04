import { SetState, GetState } from "zustand";
import { IAPISlice } from "./APISlice";
import { Store } from "@warpy/client";
import { AppActionDispatcher } from "./dispatch";

export interface ZustandStore extends Store, IAPISlice {
  set: SetState<Store>;
  get: GetState<Store>;
}
