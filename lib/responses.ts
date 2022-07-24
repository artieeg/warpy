import {
  Participant,
  Candidate,
  UserBase,
  ChatMessage,
  Invite,
  User,
  Notification,
  AwardModel,
  Award,
  AppInvite,
  Stream,
  StreamCategory,
  FriendFeedItem,
} from "./models";
import { Roles, UserList } from "./types";

export interface INewStreamResponse {
  stream: string;
  media: any;
  count: number;
  mediaPermissionsToken: string;
  recvMediaParams: IConnectRecvTransportParams;
}

export interface IJoinStreamResponse {
  streamers: Participant[];
  raisedHands: Participant[];
  count: number;
  mediaPermissionsToken: string;
  recvMediaParams: IConnectRecvTransportParams;
  sendMediaParams?: any;
  host: string;
  role: Roles;
}

export interface IRequestViewersResponse {
  viewers: Participant[];
}

export interface IFeedResponse {
  feed: Candidate[];
}

export interface IWhoAmIResponse {
  user: UserBase | null;
  following: User[];
  hasActivatedAppInvite: boolean;
  friendFeed: FriendFeedItem[];
  categories: StreamCategory[];
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
  message: ChatMessage;
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
  /** Returns null if bot's invited, returns Invite object if user's invited*/
  invite?: Invite;
}

export interface IInviteSuggestionsResponse {
  suggestions: User[];
}

export interface IUserSearchResponse {
  users: User[];
}

export interface ICancelInviteResponse {
  status: string;
}

export interface INotificationsPage {
  notifications: Notification[];
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
  user: User;
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
  users: User[];
}

export interface IUserUnblockResponse {
  status: string;
}

export interface ICoinBalanceResponse {
  balance: number;
}

export interface IGetAvailableAwardsResponse {
  awards: AwardModel[];
}

export interface ISendAwardResponse {
  status: "ok" | "error";
}

export interface IReceivedAwardsResponse {
  awards: Award[];
}

export interface IAppInviteResponse {
  invite: AppInvite;
}

export interface ICreateAnonUserResponse {
  id: string;
  access: string;
}

export interface IStreamGetResponse {
  stream: Stream;
}

export interface IGetCategoriesResponse {
  categories: StreamCategory[];
}

export interface ILeaveStreamResponse {
  status: "ok" | "error";
}

export interface IUserOnlineStatusResponse {
  user: string;
  online: boolean;
}

export interface IFriendFeedResponse {
  feed: FriendFeedItem[];
}

export interface IStreamSearchResponse {
  streams: Candidate[];
}

export interface IHostReassignResponse {
  host: string;
}
