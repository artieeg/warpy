import { IBotDevConfirmation } from "../lib";
import { WebSocketConn } from "./connection";
import { EventHandler } from "./types";

export interface IBotDevAPI {
  onCreateBotConfirmRequest: EventHandler<IBotDevConfirmation>;
  confirm: (confirmation_id: string) => void;
  cancel: (confirmation_id: string) => void;
}

export const BotDevAPI = (socket: WebSocketConn): IBotDevAPI => ({
  onCreateBotConfirmRequest: (handler) =>
    socket.on("bot-create-confirmation", handler),
  confirm: (confirmation_id) =>
    socket.publish("confirmation", { confirmation_id, flag: true }),
  cancel: (confirmation_id) =>
    socket.publish("confirmation", { confirmation_id, flag: false }),
});
