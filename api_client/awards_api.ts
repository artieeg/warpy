import { IGetAvailableAwardsResponse } from "@warpy/lib";
import { WebSocketConn } from "./connection";

export interface IAwardsAPI {
  getAvailable: () => Promise<IGetAvailableAwardsResponse>;
}

export const AwardsAPI = (socket: WebSocketConn): IAwardsAPI => ({
  getAvailable: () => socket.request("get-available-awards", {}),
});
