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
import { TransportOptions } from "./requests";
import { Roles, UserList } from "./types";

export interface IRecvTracksResponse {
  consumerParams: any[];
}

export interface ResponseNewTransport {
  sendTransportOptions: TransportOptions;
  routerRtpCapabilities: any;
}

export interface ResponseCreateMediaRoom {
  routerRtpCapabilities: any;
  sendTransportOptions: TransportOptions;
}

export interface NewStreamResponse {
  stream: string;
  media: any;
  count: number;
  mediaPermissionsToken: string;
  recvMediaParams: ConnectRecvTransportParams;
}

export interface JoinStreamResponse {
  streamers: Participant[];
  raisedHands: Participant[];
  count: number;
  mediaPermissionsToken: string;
  recvMediaParams: ConnectRecvTransportParams;
  sendMediaParams?: any;
  host: string;
  role: Roles;
}

export interface RequestViewersResponse {
  viewers: Participant[];
}

export interface FeedResponse {
  feed: Candidate[];
}

export interface WhoAmIResponse {
  user: UserBase | null;
  following: User[];
  hasActivatedAppInvite: boolean;
  friendFeed: FriendFeedItem[];
  categories: StreamCategory[];
}

export interface NewUserResponse {
  id: string;
  access: string;
  refresh: string;
}

export interface UserDeleteResponse {
  status: "ok" | "error";
}

export interface ConnectRecvTransportParams {
  roomId: string;
  user: string;
  routerRtpCapabilities: any;
  recvTransportOptions: any;
}

export interface FollowResponse {
  followedUser: any;
}

export interface UnfollowResponse {
  unfollowedUser: any;
}

export interface SendMessageResponse {
  message: ChatMessage;
}

export interface KickedFromMediaRoom {
  user: string;
  status: "ok" | "error";
}

export interface UserReportResponse {
  reportedUser: string;
}

export interface UserBlockResponse {
  blockId: string;
}

export interface InviteResponse {
  /** Returns null if bot's invited, returns Invite object if user's invited*/
  invite?: Invite;
}

export interface InviteSuggestionsResponse {
  suggestions: User[];
}

export interface UserSearchResponse {
  users: User[];
}

export interface CancelInviteResponse {
  status: string;
}

export interface NotificationsPage {
  notifications: Notification[];
}

export interface GifsResponse {
  next: string;
  gifs: string[];
}

export interface BotAuthResponse {
  status: "ok" | "error";
  bot: string; //Bot id
}

export interface BotJoinResponse {
  sendMediaParams: any;
  recvMediaParams: any;
  mediaPermissionToken: string;
}

export interface UserUpdateResponse {
  status: "ok" | "error";
  message?: string;
}

export interface UserInfoResponse {
  user: User;
  stream?: {
    id: string;
    title: string;
    participants: number;
  };
  isFollower: boolean;
  isFollowed: boolean;
}

export interface UserListResponse {
  list: UserList;
  users: User[];
}

export interface UserUnblockResponse {
  status: string;
}

export interface CoinBalanceResponse {
  balance: number;
}

export interface GetAvailableAwardsResponse {
  awards: AwardModel[];
}

export interface SendAwardResponse {
  status: "ok" | "error";
}

export interface ReceivedAwardsResponse {
  awards: Award[];
}

export interface AppInviteResponse {
  invite: AppInvite;
}

export interface CreateAnonUserResponse {
  id: string;
  access: string;
}

export interface StreamGetResponse {
  stream: Stream;
}

export interface GetCategoriesResponse {
  categories: StreamCategory[];
}

export interface LeaveStreamResponse {
  status: "ok" | "error";
}

export interface UserOnlineStatusResponse {
  user: string;
  online: boolean;
}

export interface FriendFeedResponse {
  feed: FriendFeedItem[];
}

export interface StreamSearchResponse {
  streams: Candidate[];
}

export interface HostReassignResponse {
  host: string;
}
