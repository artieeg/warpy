import { EventHandler } from "./types";
import { BotAuthResponse, EventBotInvite, BotJoinResponse } from "@warpy/lib";
import { WebSocketConn } from "./connection";

export interface IBotAPI {
  auth: (token: string) => Promise<BotAuthResponse>;
  onInvite: EventHandler<EventBotInvite>;
  join: (inviteDetailsToken: string) => Promise<BotJoinResponse>;
}

export const BotAPI = (socket: WebSocketConn): IBotAPI => ({
  auth: (token) => socket.request("auth", { token }),
  onInvite: (handler) => socket.on("bot-invite", handler),
  join: (inviteDetailsToken: string) =>
    socket.request("bot-stream-join", { inviteDetailsToken }),
});
