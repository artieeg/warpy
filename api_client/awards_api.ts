import {
  GetAvailableAwardsResponse,
  ReceivedAwardsResponse,
  SendAwardResponse,
} from "@warpy/lib";
import { WebSocketConn } from "./connection";
import { EventHandler } from "./types";

export interface IAwardsAPI {
  getAvailable: () => Promise<GetAvailableAwardsResponse>;
  getReceived: (user: string) => Promise<ReceivedAwardsResponse>;
  send: (
    visual: string,
    recipent: string,
    message: string
  ) => Promise<SendAwardResponse>;
  onNewAward: EventHandler<any>;
}

export const AwardsAPI = (socket: WebSocketConn): IAwardsAPI => ({
  getAvailable: () => socket.request("get-available-awards", {}),
  getReceived: (user) =>
    socket.request("get-received-awards", { target: user }),
  send: (visual, recipent, message) =>
    socket.request("send-award", { visual, recipent, message }),
  onNewAward: (handler) => socket.on("new-award", handler),
});
