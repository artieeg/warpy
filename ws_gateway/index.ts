import "module-alias/register";

import { onAuth, onRaiseHand, onJoinStream } from "@app/handlers";
import { IMessage } from "@app/models";
import { MessageService, PingPongService } from "@app/services";
import { Context, Handlers } from "@app/types";
import ws from "ws";

const PORT = Number.parseInt(process.env.PORT || "10000");

const server = new ws.Server({
  port: PORT,
  path: "/ws",
  host: "0.0.0.0",
});

const handlers: Handlers = {
  auth: onAuth,
  "join-stream": onJoinStream,
  "raise-hand": onRaiseHand,
};

const main = async () => {
  await MessageService.init();

  console.log("Started ws gateway service");

  server.on("connection", (ws) => {
    const context: Context = { ws };

    ws.on("message", (msg) => {
      const message: IMessage = JSON.parse(msg.toString());

      const { event, data } = message;

      handlers[event](data);
    });

    ws.on("pong", () => {
      if (context.user) {
        PingPongService.updatePing(context.user);
      }

      ws.pong();
    });
  });
};

main();
