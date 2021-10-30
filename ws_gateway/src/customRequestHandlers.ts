import { Context } from "./types";
import WebSocket from "ws";
import { Msg } from "nats";

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

    //TODO ;;;

    return {};
  },
};
