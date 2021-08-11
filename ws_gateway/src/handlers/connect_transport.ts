import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";
import { verifyMediaPermissions } from "@ws_gateway/utils";

export const onConnectTransport: Handler = async (data, context?) => {
  const user = context?.user;
  console.log(`user ${user} connects transport`, data);

  const { mediaPermissionsToken, direction } = data;
  const permissions = verifyMediaPermissions(mediaPermissionsToken);
  const { recvNodeId, sendNodeId } = permissions;

  console.log("permissions", permissions);

  if (!user) {
    return;
  }

  const eventData = {
    ...data,
    user,
  };

  if (direction === "send" && !sendNodeId) {
    return;
  }

  MessageService.sendTransportConnect(
    direction === "send" ? sendNodeId! : recvNodeId,
    direction,
    eventData
  );
};
