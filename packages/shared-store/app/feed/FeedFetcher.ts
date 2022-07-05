import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StreamedStateUpdate } from "../types";

export interface FeedFetcher {
  fetchFeedPage: (params?: { refresh?: boolean }) => StreamedStateUpdate;
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

  async *fetchFeedPage(params?: { refresh?: boolean }) {
    if (params?.refresh) {
      this.state.update({
        latestFeedPage: 0,
      });
    }

    const { latestFeedPage, api, selectedFeedCategory } = this.state.get();

    if (!selectedFeedCategory) {
      throw new Error("Feed category is not selected");
    }

    yield this.state.update({
      isFeedLoading: true,
    });

    const { feed } = await api.feed.get({
      page: latestFeedPage, //0,
      category: selectedFeedCategory.id,
    });

    yield this.state.update({
      feed: [...this.state.get().feed, ...feed],
      isFeedLoading: false,
    });
  }
}
