import {
  IParticipant,
  ICandidate,
  IBaseUser,
  IChatMessage,
  IInvite,
  IUser,
  INotification,
} from "./models";
import { UserList } from "./types";

export interface INewStreamResponse {
  stream: string;
  media: any;
  speakers: IParticipant[];
  count: number;
  mediaPermissionsToken: string;
  recvMediaParams: IConnectRecvTransportParams;
}

export interface IJoinStreamResponse {
  speakers: IParticipant[];
  raisedHands: IParticipant[];
  count: number;
  mediaPermissionsToken: string;
  recvMediaParams: IConnectRecvTransportParams;
}

export interface IRequestViewersResponse {
  viewers: IParticipant[];
}

export interface IFeedResponse {
  feed: ICandidate[];
}

export interface IWhoAmIResponse {
  user: IBaseUser | null;
  following: string[] | null;
}

export interface INewUserResponse {
  id: string;
  access: string;
  refresh: string;
}

export interface IUserDeleteResponse {
  status: "ok" | "error";
}

export interface IConnectRecvTransportParams {
  roomId: string;
  user: string;
  routerRtpCapabilities: any;
  recvTransportOptions: any;
}

export interface IFollowResponse {
  followedUser: any;
}

export interface IUnfollowResponse {
  unfollowedUser: any;
}

export interface ISendMessageResponse {
  message: IChatMessage;
}

export interface IKickedFromMediaRoom {
  user: string;
  status: "ok" | "error";
}

export interface IUserReportResponse {
  reportedUser: string;
}

export interface IUserBlockResponse {
  blockId: string;
}

export interface IInviteResponse {
  /** Returns null if bot's invited, returns IInvite object if user's invited*/
  invite?: IInvite;
}

export interface IInviteSuggestionsResponse {
  suggestions: IUser[];
}

export interface IUserSearchResponse {
  users: IUser[];
}

export interface ICancelInviteResponse {
  status: string;
}

export interface INotificationsPage {
  notifications: INotification[];
}

export interface IGifsResponse {
  next: string;
  gifs: string[];
}

export interface IBotAuthResponse {
  status: "ok" | "error";
  bot: string; //Bot id
}

export interface IBotJoinResponse {
  sendMedia: any;
  recvMedia: any;
  mediaPermissionToken: string;
}

export interface IUserUpdateResponse {
  status: "ok" | "error";
  message?: string;
}

export interface IUserInfoResponse {
  user: IUser;
  stream?: {
    id: string;
    title: string;
    participants: number;
  };
  isFollower: boolean;
  isFollowed: boolean;
}

export interface IUserListResponse {
  list: UserList;
  users: IUser[];
}

export interface IUserUnblockResponse {
  status: string;
}
