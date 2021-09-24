import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";
import { verifyMediaPermissions } from "@ws_gateway/utils";

export const onRecvTracksRequest: Handler = async (data, context, rid) => {
  const user = context?.user;

  const { mediaPermissionsToken } = data;

  if (!user) {
    return;
  }

  const eventData = {
    ...data,
    user,
  };

  const permissions = verifyMediaPermissions(mediaPermissionsToken);
  const { recvNodeId } = permissions;

  const { consumerParams } = await MessageService.sendRecvTracksRequest(
    recvNodeId,
    eventData
  );

  console.log("sending back", {
    event: "recv-tracks-response",
    data: {
      consumerParams,
    },
    rid,
  });

  context.ws.send(
    JSON.stringify({
      event: "recv-tracks-response",
      data: {
        consumerParams,
      },
      rid,
    })
  );
};
