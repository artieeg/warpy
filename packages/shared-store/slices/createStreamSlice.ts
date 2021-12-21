import { IStreamCategory } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IStreamSlice {
  stream: string | null;
  title: string | null;
  isStreamOwner: boolean;
  streamCategory: IStreamCategory | null;
}

export const createStreamSlice: StoreSlice<IStreamSlice> = () => ({
  stream: null,
  isStreamOwner: false,
  title: "",
  streamCategory: null,
});
