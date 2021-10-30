import { Context } from "./types";
import { Msg } from "nats";
import cuid from "cuid";
import { requestConfirmation } from "./confirmations";

type CustomRequestHandler = (context: Context, data: any) => Promise<any>;

export const customRequestHandlers: Record<string, CustomRequestHandler> = {
  "create-bot-confirmation": async (context, data) => {
    const confirmation_id = cuid();

    try {
      await requestConfirmation(confirmation_id, context, {
        event: "bot-create-confirmation",
        data: {
          confirmation_id,
          bot: data.bot,
        },
      });
      return { confirmed: true };
    } catch (e) {
      return { confirmed: false };
    }
  },
};
