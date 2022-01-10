import {
  IGetAvailableAwardsResponse,
  INewAward,
  IReceivedAwardsResponse,
  ISendAwardResponse,
} from "@warpy/lib";
import { WebSocketConn } from "./connection";
import { EventHandler } from "./types";

export interface IAwardsAPI {
  getAvailable: () => Promise<IGetAvailableAwardsResponse>;
  getReceived: (user: string) => Promise<IReceivedAwardsResponse>;
  send: (
    visual: string,
    recipent: string,
    message: string
  ) => Promise<ISendAwardResponse>;
  onNewAward: EventHandler<INewAward>;
}

export const AwardsAPI = (socket: WebSocketConn): IAwardsAPI => ({
  getAvailable: () => socket.request("get-available-awards", {}),
  getReceived: (user) =>
    socket.request("get-received-awards", { target: user }),
  send: (visual, recipent, message) =>
    socket.request("send-award", { visual, recipent, message }),
  onNewAward: (handler) => socket.on("new-award", handler),
});
