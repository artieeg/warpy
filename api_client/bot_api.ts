import { WebSocketConn } from "./connection";

export interface IBotAPI {
  auth: (token: string) => Promise<void>;
}

export const BotAPI = (socket: WebSocketConn): IBotAPI => ({
  auth: (token) => socket.request("auth", { token }),
});
