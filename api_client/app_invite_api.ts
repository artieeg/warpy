import { IAppInviteResponse } from "@warpy/lib";
import { WebSocketConn } from "./connection";

export interface IAppInviteAPI {
  apply: (code: string) => Promise<{ status: string }>;
  refresh: () => Promise<{ status: string }>;
  get: (user: string) => Promise<IAppInviteResponse>;
}

export const AppInviteAPI = (socket: WebSocketConn): IAppInviteAPI => ({
  get: (user_id) => socket.request("get-app-invite-data", { user_id }),
  refresh: () => socket.request("update-app-invite-data", {}),
  apply: (code) => socket.request("app-invite-apply", { code }),
});
