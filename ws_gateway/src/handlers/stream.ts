import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onJoinStream: Handler = async (data, context, rid) => {
  const { stream } = data;

  const response = await MessageService.sendBackendRequest("join-stream", {
    stream,
    user: context!.user,
  });

  console.log("sending api reqsponse", response);
  context!.ws.send(
    JSON.stringify({
      event: "@api/response",
      data: response,
      rid,
    })
  );
};
