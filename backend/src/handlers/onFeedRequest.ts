import { FeedService } from "@backend/services";
import { MessageHandler, IRequestFeed, IFeedResponse } from "@warpy/lib";

export const onFeedRequest: MessageHandler<IRequestFeed, IFeedResponse> =
  async (data, respond) => {
    const { user, hub } = data;

    const feed = await FeedService.getFeed(user, hub);

    respond({ feed });
  };
