import { IStreamCategory } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { Service } from "../Service";
import { CategoryChanger, CategoryChangerImpl } from "./CategoryChanger";
import { FeedFetcher, FeedFetcherImpl } from "./FeedFetcher";

export class FeedService
  extends Service
  implements CategoryChanger, FeedFetcher
{
  private fetcher: FeedFetcher;
  private categoryChanger: CategoryChanger;

  constructor(state: IStore | AppState) {
    super(state);

    this.fetcher = new FeedFetcherImpl(this.state);
    this.categoryChanger = new CategoryChangerImpl(this.state);
  }

  fetchNextFeedPage() {
    return this.fetcher.fetchNextFeedPage();
  }

  async changeFeedCategory(category: IStreamCategory) {
    return this.categoryChanger.changeFeedCategory(category);
  }
}
