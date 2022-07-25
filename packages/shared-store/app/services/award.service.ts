import { Award, AwardModel } from "@warpy/lib";
import { Service } from "../Service";

export interface AwardData {
  /** Maps user ids to their received awards */
  awards: Record<string, Award[]>;

  /** URL for a picked award visual */
  pickedAwardVisual: string | null;

  awardMessage: string;

  awardModels: AwardModel[];
  awardDisplayQueue: Award[];
  awardDisplayCurrent: number;
}

export class AwardService extends Service<AwardData> {
  getInitialState() {
    return {
      pickedAwardVisual: null,
      awardMessage: "",
      awards: {},
      awardModels: [],
      receivedAwards: [],
      awardDisplayQueue: [],
      awardDisplayCurrent: 0,
    };
  }
}
