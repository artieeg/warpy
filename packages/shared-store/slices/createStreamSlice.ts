import { IStreamCategory } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IStreamSlice {
  stream: string | null;
  title: string | null;
  isStreamOwner: boolean;
  newStreamCategory: IStreamCategory | null;
  selectedFeedCategory: IStreamCategory | null;
}

export const createStreamSlice: StoreSlice<IStreamSlice> = () => ({
  stream: null,
  isStreamOwner: false,
  title: "",
  newStreamCategory: null,
  selectedFeedCategory: null,
});
