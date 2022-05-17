import { IUser } from "./models";
import {
  MediaDirection,
  MediaKind,
  MediaServiceRole,
  Roles,
  UserList,
} from "./types";

export interface ITransportOptions {
  id: string;
  iceParameters: any;
  iceCandidates: any[];
  dtlsParameters: any;
}

export interface IClap {
  stream: string;
}

export interface ICreateMediaRoom {
  host: string;
  roomId: string;
}

export interface INewMediaRoomData {
  routerRtpCapabilities: any;
  sendTransportOptions: ITransportOptions;
}

export interface INewMediaTrack {
  roomId: string;
  user: string;
  direction: MediaDirection;
  kind: MediaKind;
  rtpParameters: any;
  rtpCapabilities: any;
  transportId: string;
  appData: any;
  mediaPermissionsToken: any;
}

export interface IJoinMediaRoom {
  roomId: string;
  user: string;
}

export interface ICreateTransport {
  roomId: string;
  speaker: string;
}

export interface INewTransportResponse {
  sendTransportOptions: ITransportOptions;
  routerRtpCapabilities: any;
}

export interface IConnectMediaTransport {
  transportId: string;
  dtlsParameters: any;
  direction: MediaDirection;
  mediaKind?: any;
  roomId: string;
  user: string;
}

/*
export interface INewMediaTrack {
  transportId: string;
  kind: MediaKind;
  rtpParameters: any;
  rtpCapabilities: any;
  paused: boolean;
  roomId: string;
  direction: MediaDirection;
  appData: any;
}
*/

export interface IRecvTracksRequest {
  stream: string;
  user: string;
  rtpCapabilities: any;
  mediaPermissionsToken: string;
}

export interface IRecvTracksResponse {
  consumerParams: any[];
}

export interface IConnectMediaServer {
  node: string;
  ip: string;
  port: number;
  srtp?: any;
}

export interface INewProducer {
  id: string;
  kind: MediaKind;
  rtpParameters: any;
  rtpCapabilities: any;
  appData: any;
  roomId: string;
  userId: string;
}

export interface INewMediaNode {
  id: string;
  role: MediaServiceRole;
}

export interface IRequestViewers {
  user: string;
  stream: string;
  page: number;
}

export interface IWhoAmIRequest {
  user: string;
}

export interface INewStream {
  user: string;
  title: string;
  category: string;
}

export interface IJoinStream {
  stream: string;
  user: string;
}

export interface IStopStream {
  stream: string;
  user: string;
}

export interface IUserDisconnected {
  user: string;
}

export interface IRaiseHand {
  user: string;
  flag: boolean;
}

export interface IRequestFeed {
  user: string;
  category?: string;
}

export interface INewUser {
  username: string;
  last_name: string;
  first_name: string;
  avatar: string;
  email: string;
  kind: "dev" | "apple" | "google" | "twitter" | "facebook";
}

export interface IActiveSpeakersPayload {
  speakers: Record<string, { user: string; volume: number }[]>;
}

export interface IUserDelete {
  user: string;
}

export interface IRecordRequest {
  remoteRtpPort: number;
  localRtcpPort?: number;
  rtpCapabilities: any;
  rtpParameters: any;
  stream: string;
  user: string;
}

export interface IClap {
  user: string;
  emoji: string;
  stream: string;
}

export interface IFollowRequest {
  user: string;
  userToFollow: string;
}

export interface IUnfollowRequest {
  user: string;
  userToUnfollow: string;
}

export interface INewChatMessage {
  user: string;
  message: string;
}

export interface IKickUserRequest {
  user: string;
  userToKick: string;
}

export interface IUserReportRequest {
  reportedUserId: string;
  reportReasonId: string;
  user: string;
}

export interface IUserBlockRequest {
  userToBlock: string;
  user: string;
}

export interface IInviteRequest {
  invitee: string;
  stream?: string;
  user: string;
}

export interface IInviteSuggestionsRequest {
  user: string;
  stream: string;
}

export interface IUserSearchRequest {
  textToSearch: string;
  user: string;
}

export interface ICancelInviteRequest {
  user: string;
  invite_id: string;
}

export interface IReadNotifications {
  user: string;
}

export interface IGetUnreadNotifications {
  user: string;
}

export interface IGetReadNotifications {
  user: string;
  page: number;
}

export interface IGifsRequest {
  search?: string;
  next?: string;
}

export interface ISetRoleRequest {
  user: string;
  userToUpdate: string;
  role: Roles;
}

export interface IRemoveUserProducersRequest {
  user: string;
  stream: string;
  producers: {
    audio?: boolean;
    video?: boolean;
  };
}

export interface IMediaToggleRequest {
  user: string;
  videoEnabled?: boolean;
  audioEnabled?: boolean;
}

export interface IBotJoin {
  user: string;
  inviteDetailsToken: string;
}

export interface IUserUpdateRequest {
  user: string;
  data: Partial<IUser>;
}

export interface IUserRequest {
  user: string;
  id: string;
}

export interface IInviteActionRequest {
  user: string;
  invite: string;
  action: "accept" | "decline";
}

export interface IUserListRequest {
  user: string;
  list: UserList;
  page: number;
}

export interface IGetCoinBalanceRequest {
  user: string;
}

export interface ISendAwardRequest {
  user: string;
  message: string;
  visual: string;
  recipent: string;
}

export interface IFetchReceivedAwardsRequest {
  target: string;
}

export interface IAppInviteRequest {
  user_id: string;
}

export interface IInviteApplyRequest {
  user: string;
  code: string;
}

export interface IStreamGetRequest {
  stream: string;
}

export interface ILeaveStreamRequest {
  user: string;
  stream: string;
}

export interface IUserStatusRequest {
  user: string;
}

export interface IFriendFeedRequest {
  user: string;
}

export interface IStreamSearchRequest {
  textToSearch: string;
}

export interface IMediaNodeInfoRequest {
  node: string;
  load: number;
  role: string;
}

export interface IHostReassignRequest {
  host: string;
  user: string;
}
