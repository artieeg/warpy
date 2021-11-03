import { EventHandler } from "./types";
import { IBotAuthResponse, IBotInviteEvent } from "@warpy/lib";
import { WebSocketConn } from "./connection";

export interface IBotAPI {
  auth: (token: string) => Promise<IBotAuthResponse>;
  onInvite: EventHandler<IBotInviteEvent>;
}

export const BotAPI = (socket: WebSocketConn): IBotAPI => ({
  auth: (token) => socket.request("auth", { token }),
  onInvite: (handler) => socket.on("bot-invite", handler),
});
