import { IStreamCategory } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { CategoryChanger, CategoryChangerImpl } from "./CategoryChanger";
import { FeedFetcher, FeedFetcherImpl } from "./FeedFetcher";

export class FeedService implements CategoryChanger, FeedFetcher {
  private fetcher: FeedFetcher;
  private categoryChanger: CategoryChanger;

  constructor(state: IStore | AppState) {
    this.fetcher = new FeedFetcherImpl(state);
    this.categoryChanger = new CategoryChangerImpl(state);
  }

  fetchNextFeedPage() {
    return this.fetcher.fetchNextFeedPage();
  }

  async changeFeedCategory(category: IStreamCategory) {
    return this.categoryChanger.changeFeedCategory(category);
  }
}
