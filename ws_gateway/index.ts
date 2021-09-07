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
  onNewStream,
  onFeedRequest,
  onNewUser,
  onUserDelete,
  onReaction,
  onFollow,
  onUnfollow,
} from "@ws_gateway/handlers";
import { IMessage } from "@ws_gateway/models";
import { Context, Handlers } from "@ws_gateway/types";
import ws from "ws";
import { MessageService, PingPongService } from "@ws_gateway/services";
import { onConnectTransport } from "@ws_gateway/handlers/connect_transport";

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
  "stream-new": onNewStream,
  "request-feed": onFeedRequest,
  "new-user": onNewUser,
  "delete-user": onUserDelete,
  reaction: onReaction,
  "user-follow": onFollow,
  "user-unfollow": onUnfollow,
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

    ws.on("message", async (msg) => {
      const message: IMessage = JSON.parse(msg.toString());

      const { event, data, rid } = message;

      try {
        await handlers[event](data, context, rid);
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
