import { StreamCategory } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IStreamSlice {
  stream: string | null;
  title: string | null;
  currentStreamHost: string;
  newStreamCategory: StreamCategory | null;
  selectedFeedCategory: StreamCategory | null;
  isStartingNewStream: boolean;
}

export const createStreamSlice: StoreSlice<IStreamSlice> = () => ({
  stream: null,
  currentStreamHost: "",
  title: "",
  newStreamCategory: null,
  isStartingNewStream: false,
  selectedFeedCategory: null,
});
