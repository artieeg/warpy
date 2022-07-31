import { FeedResponse } from "@warpy/lib";
import { APIModule } from "./types";

type FeedFetchRequest = {
  page?: number;
  category?: string;
};

export interface IFeedAPI {
  get: (params: FeedFetchRequest) => Promise<FeedResponse>;
}

export const FeedAPI: APIModule = (socket): IFeedAPI => ({
  get: (params) =>
    socket.request("request-feed", {
      ...params,
      page: params.page ?? 0,
    }),
});
