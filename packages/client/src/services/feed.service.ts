import { Candidate, Stream, StreamCategory } from "@warpy/lib";
import { Service } from "../Service";

export interface FeedData {
  latestFeedPage: number;
  feed: Candidate[];
  previousStreamData: Stream | null;
  isFeedLoading: boolean;
  categories: StreamCategory[];
  initialFeedFetchDone: boolean;
}

export class FeedService extends Service<FeedData> {
  getInitialState() {
    return {
      latestFeedPage: 0,
      isFeedLoading: false,
      previousStreamData: null,
      feed: [],
      categories: [],
      initialFeedFetchDone: false,
    };
  }

  async *fetchFeedPage(params?: { initial?: boolean; refresh?: boolean }) {
    if (params?.refresh) {
      this.set({
        latestFeedPage: 0,
      });
    }

    const { latestFeedPage, api, selectedFeedCategory } = this.get();

    if (!selectedFeedCategory) {
      throw new Error("Feed category is not selected");
    }

    yield this.set({
      isFeedLoading: true,
    });

    const { feed } = await api.feed.get({
      page: latestFeedPage, //0,
      category: selectedFeedCategory.id,
    });

    yield this.set({
      feed,
      isFeedLoading: false,
      initialFeedFetchDone: params?.initial === true,
    });
  }

  async changeFeedCategory(category: StreamCategory) {
    // select "for u" category when deselecting current category
    const selectedFeedCategory =
      this.get().selectedFeedCategory?.id === category.id
        ? this.get().categories[0]
        : category;

    return this.set({
      selectedFeedCategory,
      feed: [],
      latestFeedPage: 0,
    });
  }
}
