import { Context } from "./types";
import WebSocket from "ws";

type CustomEventHandler = (context: Context, data: any) => Promise<void>;

export const customEventHandlers: Record<string, CustomEventHandler> = {
  "chat-message": async (context, data) => {
    context.batchedChatMessages.push(data.message);

    if (!context.messageSendInterval) {
      context.messageSendInterval = setInterval(() => {
        if (context.ws.readyState === WebSocket.OPEN) {
          context.ws.send(
            JSON.stringify({
              event: "chat-messages",
              data: {
                messages: context.batchedChatMessages,
              },
            })
          );

          context.batchedChatMessages = [];
        }
      }, 5000);
    }
  },
};
