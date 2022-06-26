type DURATION = "LONG" | "SHORT";
import { StoreSlice } from "../types";

export interface IToastSlice {
  message: string | null;
  duration: DURATION | null;
}

export const createToastSlice: StoreSlice<IToastSlice> = () => ({
  message: null,
  duration: null,
});
