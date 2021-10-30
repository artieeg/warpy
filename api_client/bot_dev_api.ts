import { IBotDevConfirmation } from "../lib";
import { WebSocketConn } from "./connection";
import { EventHandler } from "./types";

export interface IBotDevAPI {
  onCreateBotConfirmRequest: EventHandler<IBotDevConfirmation>;
  confirmNewBot: (confirmation_id: string) => void;
}

export const BotDevAPI = (socket: WebSocketConn): IBotDevAPI => ({
  onCreateBotConfirmRequest: (handler) =>
    socket.on("bot-create-confirmation", handler),
  confirmNewBot: (confirmation_id) =>
    socket.publish("bot-create-confirmation", { confirmation_id }),
});
