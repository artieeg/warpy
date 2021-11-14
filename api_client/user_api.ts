import {
  IFollowResponse,
  INewUserResponse,
  IUnfollowResponse,
  IUser,
  IUserBlockResponse,
  IUserDeleteResponse,
  IUserInfoResponse,
  IUserSearchResponse,
  IUserUpdateResponse,
  IWhoAmIResponse,
} from "@warpy/lib";
import { WebSocketConn } from "./connection";

export interface IUserAPI {
  create: (data: INewUser) => Promise<INewUserResponse>;
  auth: (token: string) => Promise<IWhoAmIResponse>;
  delete: () => Promise<IUserDeleteResponse>;
  follow: (userToFollow: string) => Promise<IFollowResponse>;
  unfollow: (userToUnfollow: string) => Promise<IUnfollowResponse>;
  search: (textToSearch: string) => Promise<IUserSearchResponse>;
  update: (field: keyof IUser, value: string) => Promise<IUserUpdateResponse>;
  report: (
    userToReport: string,
    reportReasonId: string
  ) => Promise<INewUserResponse>;
  block: (userToBlock: string) => Promise<IUserBlockResponse>;
  get: (id: string) => Promise<IUserInfoResponse>;
}

export interface INewUser {
  username: string;
  last_name: string;
  first_name: string;
  email: string;
  avatar: string;
  kind: "dev" | "apple" | "google" | "twitter" | "facebook";
}

export const UserAPI = (socket: WebSocketConn): IUserAPI => ({
  create: (data: INewUser) => socket.request("new-user", data),
  auth: (token) => socket.request("auth", { token }),
  get: (id) => socket.request("get-user", { id }),
  delete: () => socket.request("delete-user", {}),
  search: (textToSearch) => socket.request("search-user", { textToSearch }),
  update: (field, value) =>
    socket.request("update-user", { data: { [field]: value } }),
  follow: (userToFollow) => socket.request("user-follow", { userToFollow }),
  block: (userToBlock: string) => socket.request("block-user", { userToBlock }),
  report: (reportedUserId, reportReasonId) =>
    socket.request("report-user", { reportedUserId, reportReasonId }),
  unfollow: (userToUnfollow) =>
    socket.request("user-unfollow", { userToUnfollow }),
});
