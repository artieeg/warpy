import { IGetAvailableAwardsResponse, ISendAwardResponse } from "@warpy/lib";
import { WebSocketConn } from "./connection";

export interface IAwardsAPI {
  getAvailable: () => Promise<IGetAvailableAwardsResponse>;
  send: (
    award_id: string,
    recipent: string,
    message: string
  ) => Promise<ISendAwardResponse>;
}

export const AwardsAPI = (socket: WebSocketConn): IAwardsAPI => ({
  getAvailable: () => socket.request("get-available-awards", {}),
  send: (award_id, recipent, message) =>
    socket.request("send-award", { award_id, recipent, message }),
});
