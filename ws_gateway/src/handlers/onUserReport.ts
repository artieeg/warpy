import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onUserReport: Handler = async (data, context, rid) => {
  const user = context.user;

  const response = await MessageService.sendBackendRequest("report-user", {
    user,
    reportedUserId: data.reportedUserId,
    reportReasonId: data.reportReasonId,
  });

  context.ws.send(
    JSON.stringify({
      event: "@api/response",
      data: response,
      rid,
    })
  );
};
