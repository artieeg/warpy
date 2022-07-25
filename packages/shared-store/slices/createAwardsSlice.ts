import { Award, AwardModel } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IAwardsSlice {
  /** Maps user ids to their received awards */
  awards: Record<string, Award[]>;

  /** URL for a picked award visual */
  pickedAwardVisual: string | null;

  awardMessage: string;

  awardModels: AwardModel[];
  awardDisplayQueue: Award[];
  awardDisplayCurrent: number;
}

export const createAwardsSlice: StoreSlice<IAwardsSlice> = () => ({
  pickedAwardVisual: null,
  awardMessage: "",
  awards: {},
  awardModels: [],
  receivedAwards: [],
  awardDisplayQueue: [],
  awardDisplayCurrent: 0,
});
