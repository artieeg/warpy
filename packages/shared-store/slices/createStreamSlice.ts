import { IStreamCategory } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IStreamSlice {
  stream: string | null;
  title: string | null;
  currentStreamHost: string;
  newStreamCategory: IStreamCategory | null;
  selectedFeedCategory: IStreamCategory | null;
}

export const createStreamSlice: StoreSlice<IStreamSlice> = () => ({
  stream: null,
  currentStreamHost: "",
  title: "",
  newStreamCategory: null,
  selectedFeedCategory: null,
});
