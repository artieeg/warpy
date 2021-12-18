import { IStreamCategory } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IStreamCategoriesSlice {
  categories: IStreamCategory[];
}

export const createStreamCategoriesSlice: StoreSlice<IStreamCategoriesSlice> =
  () => ({
    categories: [],
  });
