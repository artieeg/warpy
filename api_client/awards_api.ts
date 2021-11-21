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
    award_id: string,
    recipent: string,
    message: string
  ) => Promise<ISendAwardResponse>;
  onNewAward: EventHandler<INewAward>;
}

export const AwardsAPI = (socket: WebSocketConn): IAwardsAPI => ({
  getAvailable: () => socket.request("get-available-awards", {}),
  getReceived: (user) =>
    socket.request("get-received-awards", { target: user }),
  send: (award_id, recipent, message) =>
    socket.request("send-award", { award_id, recipent, message }),
  onNewAward: (handler) => socket.on("new-award", handler),
});
