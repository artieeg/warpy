import "module-alias/register";

import {
  onAuth,
  onRaiseHand,
  onJoinStream,
  onAllowSpeaker,
  onNewTrack,
  onRecvTracksRequest,
  onViewersRequest,
  onStreamStop,
} from "@ws_gateway/handlers";
import { IMessage } from "@ws_gateway/models";
import { Context, Handlers } from "@ws_gateway/types";
import ws from "ws";
import { MessageService, PingPongService } from "@ws_gateway/services";
import { onConnectTransport } from "@ws_gateway/handlers/connect_transport";
import { onWhoAmI } from "@ws_gateway/handlers/onWhoAmI";

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
  "speaker-allow": onAllowSpeaker,
  "new-track": onNewTrack,
  "connect-transport": onConnectTransport,
  "recv-tracks-request": onRecvTracksRequest,
  "request-viewers": onViewersRequest,
  "stream-stop": onStreamStop,
  whoami: onWhoAmI,
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
    const context: Context = { ws };

    ws.ping();

    ws.on("message", (msg) => {
      const message: IMessage = JSON.parse(msg.toString());

      const { event, data } = message;

      handlers[event](data, context);
    });

    ws.on("pong", () => {
      if (context.user) {
        PingPongService.updatePing(context.user);
      }

      setTimeout(() => {
        ws.ping();
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
