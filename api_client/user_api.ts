import {
  FollowResponse,
  NewUserResponse,
  UnfollowResponse,
  User,
  UserBlockResponse,
  UserDeleteResponse,
  UserInfoResponse,
  UserListResponse,
  UserSearchResponse,
  UserUpdateResponse,
  WhoAmIResponse,
  UserUnblockResponse,
  UserList,
  CreateAnonUserResponse,
} from "@warpy/lib";
import { WebSocketConn } from "./connection";

export interface IUserAPI {
  create: (data: INewUser) => Promise<NewUserResponse>;
  createAnonUser: () => Promise<CreateAnonUserResponse>;
  auth: (token: string) => Promise<WhoAmIResponse>;
  delete: () => Promise<UserDeleteResponse>;
  follow: (userToFollow: string) => Promise<FollowResponse>;
  unfollow: (userToUnfollow: string) => Promise<UnfollowResponse>;
  search: (textToSearch: string) => Promise<UserSearchResponse>;
  update: (field: keyof User, value: string) => Promise<UserUpdateResponse>;
  report: (
    userToReport: string,
    reportReasonId: string
  ) => Promise<NewUserResponse>;
  block: (userToBlock: string) => Promise<UserBlockResponse>;
  unblock: (userToUnblock: string) => Promise<UserUnblockResponse>;
  get: (id: string) => Promise<UserInfoResponse>;
  fetchUserList: (list: UserList, page?: number) => Promise<UserListResponse>;
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
  createAnonUser: () => socket.request("new-anon-user", {}),
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
});
