import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StreamedStateUpdate } from "../types";

export interface FeedFetcher {
  fetchNextFeedPage: () => StreamedStateUpdate;
}

export class FeedFetcherImpl implements FeedFetcher {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async *fetchNextFeedPage() {
    const { latestFeedPage, api, selectedFeedCategory } = this.state.get();

    if (!selectedFeedCategory) {
      throw new Error("Feed category is not selected");
    }

    yield this.state.update({
      isFeedLoading: true,
    });

    //console.log({ selectedFeedCategory });

    //const categoryId = selectedFeedCategory.id;

    const { feed } = await api.feed.get({
      page: 0,
      category: selectedFeedCategory.id,
    });

    yield this.state.update({
      feed: [...this.state.get().feed, ...feed],
      isFeedLoading: false,
    });
  }
}
