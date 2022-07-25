import { StreamCategory } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IStreamCategoriesSlice {
  categories: StreamCategory[];
}

export const createStreamCategoriesSlice: StoreSlice<IStreamCategoriesSlice> =
  () => ({
    categories: [],
  });
