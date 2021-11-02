import { IBotAuthResponse } from "@warpy/lib";
import { WebSocketConn } from "./connection";

export interface IBotAPI {
  auth: (token: string) => Promise<IBotAuthResponse>;
}

export const BotAPI = (socket: WebSocketConn): IBotAPI => ({
  auth: (token) => socket.request("auth", { token }),
});
