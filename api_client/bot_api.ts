import { EventHandler } from "./types";
import {
  IBotAuthResponse,
  IBotInviteEvent,
  IBotJoinResponse,
} from "@warpy/lib";
import { WebSocketConn } from "./connection";

export interface IBotAPI {
  auth: (token: string) => Promise<IBotAuthResponse>;
  onInvite: EventHandler<IBotInviteEvent>;
  join: (inviteDetailsToken: string) => Promise<IBotJoinResponse>;
}

export const BotAPI = (socket: WebSocketConn): IBotAPI => ({
  auth: (token) => socket.request("auth", { token }),
  onInvite: (handler) => socket.on("bot-invite", handler),
  join: (inviteDetailsToken: string) =>
    socket.request("bot-stream-join", { inviteDetailsToken }),
});
