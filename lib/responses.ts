import {
  IParticipant,
  ICandidate,
  IBaseUser,
  IChatMessage,
  IInvite,
  IUser,
} from "./models";

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
  invite: IInvite;
}

export interface IInviteSuggestionsResponse {
  suggestions: IUser[];
}

export interface IUserSearchResponse {
  users: IUser[];
}
