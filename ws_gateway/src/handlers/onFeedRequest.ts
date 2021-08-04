import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onFeedRequest: Handler = async (_, context, rid) => {
  if (!context) {
    return;
  }

  const user = context.user;

  const data = await MessageService.sendBackendRequest("feed-request", {
    user,
  });

  context.ws.send(
    JSON.stringify({
      event: "@api/response",
      data: {
        feed: data.feed,
      },
      rid,
    })
  );
};
