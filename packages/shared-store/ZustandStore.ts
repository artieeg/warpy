import { SetState, GetState } from "zustand";
import { IAPISlice } from "./APISlice";
import { Store } from "./app/Store";
import { AppActionDispatcher } from "./dispatch";

export interface ZustandStore extends Store, AppActionDispatcher, IAPISlice {
  set: SetState<Store>;
  get: GetState<Store>;
}
