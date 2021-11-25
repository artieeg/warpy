import {
  IFollowResponse,
  INewUserResponse,
  IUnfollowResponse,
  IUser,
  IUserBlockResponse,
  IUserDeleteResponse,
  IUserInfoResponse,
  IUserListResponse,
  IUserSearchResponse,
  IUserUpdateResponse,
  IWhoAmIResponse,
  IUserUnblockResponse,
  UserList,
  IAppInviteResponse,
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
  unblock: (userToUnblock: string) => Promise<IUserUnblockResponse>;
  get: (id: string) => Promise<IUserInfoResponse>;
  fetchUserList: (list: UserList, page?: number) => Promise<IUserListResponse>;
  getAppInvite: (user: string) => Promise<IAppInviteResponse>;
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
  unblock: (userToUnblock: string) =>
    socket.request("unblock-user", { userToUnblock }),
  report: (reportedUserId, reportReasonId) =>
    socket.request("report-user", { reportedUserId, reportReasonId }),
  unfollow: (userToUnfollow) =>
    socket.request("user-unfollow", { userToUnfollow }),
  fetchUserList: (list, page = 0) =>
    socket.request("user-list", { list, page }),

  getAppInvite: (user_id) => socket.request("get-app-invite-data", { user_id }),
});
