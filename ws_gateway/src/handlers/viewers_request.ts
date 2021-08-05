import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onViewersRequest: Handler = async (data, context, rid) => {
  const { page, stream } = data;

  if (!context || !context.user) {
    return;
  }

  const viewers = await MessageService.sendBackendRequest("request-viewers", {
    page,
    stream,
    user: context.user,
  });

  context.ws.send(
    JSON.stringify({
      event: "viewers",
      data: {
        viewers,
        page,
      },
      rid,
    })
  );
};
