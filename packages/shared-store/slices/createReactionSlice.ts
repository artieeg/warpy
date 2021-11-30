import { reactionCodes } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IReactionSlice {
  reaction: string;
}

export const createReactionSlice: StoreSlice<IReactionSlice> = () => ({
  reaction: reactionCodes[0],
});
