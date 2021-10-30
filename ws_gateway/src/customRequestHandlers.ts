import { Context } from "./types";
import WebSocket from "ws";
import { Msg } from "nats";
import cuid from "cuid";
import { confirmations, requestConfirmation } from "./confirmations";

type CustomRequestHandler = (
  context: Context,
  data: any,
  msg: Msg
) => Promise<any>;

export const customRequestHandlers: Record<string, CustomRequestHandler> = {
  "bot-create-confirmation": async (context, data, msg) => {
    if (!msg.reply) {
      return;
    }

    const confirmation_id = cuid();

    await requestConfirmation(confirmation_id, context, {
      event: "bot-create-confirmation",
      data: {
        confirmation_id,
        bot: data.bot,
      },
    });

    return {};
  },
};
