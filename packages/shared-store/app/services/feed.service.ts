import { StreamCategory } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { Service } from "../Service";

export class FeedService extends Service {
  constructor(state: IStore | AppState) {
    super(state);
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

  async changeFeedCategory(category: StreamCategory) {
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
