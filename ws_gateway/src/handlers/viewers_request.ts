import { MessageService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/types";

export const onViewersRequest: Handler = async (data, context?) => {
  const { page, stream } = data;

  if (!context || !context.user) {
    return;
  }

  MessageService.sendViewersRequest({
    page,
    stream,
    user: context.user,
  });
};
