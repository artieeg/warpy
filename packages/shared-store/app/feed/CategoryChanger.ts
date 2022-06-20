import { IStreamCategory } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StateUpdate } from "../types";

export interface CategoryChanger {
  changeFeedCategory: (category: IStreamCategory) => Promise<StateUpdate>;
}

export class CategoryChangerImpl implements CategoryChanger {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async changeFeedCategory(category: IStreamCategory) {
    // select "for u" category when deselecting current category
    const selectedFeedCategory =
      this.state.get().selectedFeedCategory?.id === category.id
        ? this.state.get().categories[0]
        : category;

    return this.state.update({
      selectedFeedCategory,
      feed: [],
      latestFeedPage: 0,
    });
  }
}
