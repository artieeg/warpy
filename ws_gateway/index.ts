import "module-alias/register";
import joi from "joi";
import { handle } from "./src/handle";
import { IMessage } from "@ws_gateway/models";
import { Context, HandlerConfig } from "@ws_gateway/types";
import ws from "ws";
import { MessageService, PingPongService } from "@ws_gateway/services";
import {
  onAuth,
  onRecvTracksRequest,
  onConnectTransport,
} from "@ws_gateway/handlers";
import { Roles } from "@warpy/lib";

const PORT = Number.parseInt(process.env.PORT || "10000");

const server = new ws.Server({
  port: PORT,
  path: "/ws",
  host: "0.0.0.0",
});

const handlers: Record<string, HandlerConfig> = {
  "join-stream": {
    subject: "stream.join",
    kind: "request",
    auth: true,
    schema: joi.object({
      stream: joi.string().max(64).required(),
    }),
  },
  "raise-hand": {
    subject: "user.raise-hand",
    kind: "event",
    auth: true,
    schema: joi.object({}),
  },
  "speaker-allow": {
    subject: "speaker.allow",
    kind: "event",
    auth: true,
    schema: joi.object({
      speaker: joi.string().max(64).required(),
    }),
  },
  "new-track": {
    subject: "media.track.send",
    kind: "event",
    auth: true,
    schema: joi.object().unknown(),
  },
  "request-viewers": {
    subject: "viewers.get",
    kind: "request",
    auth: true,
    schema: joi.object({
      page: joi.number().min(0).required(),
      stream: joi.string().max(64).required(),
    }),
  },
  "stream-stop": {
    subject: "stream.stop",
    kind: "event",
    auth: true,
    schema: joi.object({
      stream: joi.string().max(64).required(),
    }),
  },
  "stream-new": {
    subject: "stream.create",
    kind: "request",
    auth: true,
    schema: joi.object({
      title: joi.string().min(3).max(64).required(),
      hub: joi.string().max(64).required(),
    }),
  },
  "request-feed": {
    subject: "feeds.get",
    kind: "request",
    auth: true,
    schema: joi.object({ page: joi.number().min(0).required() }),
  },
  "new-user": {
    subject: "user.create",
    kind: "request",
    auth: false,
    schema: joi.object().unknown(),
  },
  "delete-user": {
    subject: "user.delete",
    kind: "request",
    auth: true,
    schema: joi.object({}),
  },
  reaction: {
    subject: "stream.reaction",
    kind: "event",
    auth: true,
    schema: joi.object({
      stream: joi.string().max(64).required(),
      emoji: joi.string().max(64).required(),
    }),
  },
  "user-follow": {
    subject: "user.follow",
    kind: "request",
    auth: true,
    schema: joi.object({
      userToFollow: joi.string().max(64).required(),
    }),
  },
  "user-unfollow": {
    subject: "user.unfollow",
    kind: "request",
    auth: true,
    schema: joi.object({
      userToUnfollow: joi.string().max(64).required(),
    }),
  },
  "new-chat-message": {
    subject: "stream.new-chat-message",
    kind: "request",
    auth: true,
    schema: joi.object({
      message: joi.string().max(500).required(),
    }),
  },
  "kick-user": {
    subject: "stream.kick-user",
    kind: "event",
    auth: true,
    schema: joi.object({
      userToKick: joi.string().max(64).required(),
    }),
  },
  "report-user": {
    subject: "user.report",
    kind: "request",
    auth: true,
    schema: joi.object({
      reportedUserId: joi.string().max(64).required(),
      reportReasonId: joi.string().max(64).required(),
    }),
  },
  "block-user": {
    subject: "user.block",
    kind: "request",
    auth: true,
    schema: joi.object({
      userToBlock: joi.string().max(64).required(),
    }),
  },
  "invite-user": {
    schema: joi.object({
      invitee: joi.string().max(64).required(),
      stream: joi.string().max(64).required(),
    }),
    kind: "request",
    auth: true,
    subject: "user.invite",
  },

  "invite-suggestions": {
    schema: joi.object({
      stream: joi.string().max(64).required(),
    }),
    kind: "request",
    auth: true,
    subject: "user.invite-suggestions",
  },

  "read-notifications": {
    schema: joi.object({}),
    kind: "event",
    auth: true,
    subject: "notifications.read",
  },

  "search-user": {
    schema: joi.object({
      textToSearch: joi.string().max(64).required(),
    }),
    kind: "request",
    auth: true,
    subject: "user.search",
  },

  "get-read-notifications": {
    schema: joi.object({ page: joi.number().min(0) }),
    kind: "request",
    auth: true,
    subject: "notifications.get-read",
  },

  "get-unread-notifications": {
    schema: joi.object({}),
    kind: "request",
    auth: true,
    subject: "notifications.get-unread",
  },

  "cancel-stream-invite": {
    schema: joi.object({
      invite_id: joi.string().max(64).required(),
    }),
    kind: "request",
    auth: true,
    subject: "user.cancel-invite",
  },

  "search-gifs": {
    schema: joi.object({
      search: joi.string().required(),
      next: joi.string().optional(),
    }),
    kind: "request",
    subject: "gifs.search",
  },

  "get-trending-gifs": {
    schema: joi.object({
      next: joi.string().optional(),
    }),
    kind: "request",
    subject: "gifs.trending",
  },

  "set-role": {
    schema: joi.object({
      userToUpdate: joi.string().max(64).required(),
      role: joi
        .string()
        .valid(...(["viewer", "speaker", "streamer"] as Roles[])),
    }),
    kind: "request",
    auth: true,
    subject: "participant.set-role",
  },

  auth: {
    schema: joi.object({
      token: joi.string().max(400).required(),
    }),
    customHandler: onAuth,
  },
  "connect-transport": {
    schema: joi.object().unknown(),
    customHandler: onConnectTransport,
  },
  "recv-tracks-request": {
    schema: joi.object().unknown(),
    customHandler: onRecvTracksRequest,
  },
};

const main = async () => {
  await MessageService.init();
  PingPongService.run();

  console.log("Started ws gateway service");

  const onUserDisconnect = (user: string) => {
    MessageService.sendBackendMessage("user.disconnected", { user });
  };

  PingPongService.observer.on("user-disconnected", onUserDisconnect);

  server.on("connection", (ws) => {
    const context: Context = { ws, batchedChatMessages: [] };

    ws.ping();

    ws.on("message", async (msg) => {
      const message: IMessage = JSON.parse(msg.toString());

      const { event, data, rid } = message;

      try {
        await handle({ data, event, context, rid, handler: handlers[event] });
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
