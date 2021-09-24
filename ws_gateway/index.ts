import "module-alias/register";
import joi from "joi";
import { handle } from "./src/handler";

import { IMessage } from "@ws_gateway/models";
import { Context } from "@ws_gateway/types";
import ws from "ws";
import { MessageService, PingPongService } from "@ws_gateway/services";
import { Handler } from "@ws_gateway/models/handler";

const PORT = Number.parseInt(process.env.PORT || "10000");

const server = new ws.Server({
  port: PORT,
  path: "/ws",
  host: "0.0.0.0",
});

const handlers: Record<string, Handler> = {
  "join-stream": {
    subject: "stream.join",
    kind: "event",
    auth: true,
    schema: joi.object({
      stream: joi.string().max(64).required(),
    }),
  },
};

const main = async () => {
  await MessageService.init();
  PingPongService.run();

  console.log("Started ws gateway service");

  const onUserDisconnect = (user: string) => {
    MessageService.sendBackendMessage("user-disconnected", { user });
  };

  PingPongService.observer.on("user-disconnected", onUserDisconnect);

  server.on("connection", (ws) => {
    const context: Context = { ws, batchedChatMessages: [] };

    ws.ping();

    ws.on("message", async (msg) => {
      const message: IMessage = JSON.parse(msg.toString());

      const { event, data, rid } = message;

      try {
        await handle({ data, context, rid, handler: handlers[event] });
      } catch (e) {
        console.log("failed to process", event);

        console.error(e);
      }
    });

    ws.on("pong", () => {
      if (context.user) {
        PingPongService.updatePing(context.user);
      }

      setTimeout(() => {
        try {
          ws.ping();
        } catch (e) {
          console.error(e);
        }
      }, 1000);
    });

    ws.on("close", () => {
      if (context.user) {
        onUserDisconnect(context.user);
      }
    });
  });
};

main();
