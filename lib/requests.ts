import { User } from "./models";
import {
  MediaDirection,
  MediaKind,
  MediaServiceRole,
  Roles,
  UserList,
} from "./types";

export interface TransportOptions {
  id: string;
  iceParameters: any;
  iceCandidates: any[];
  dtlsParameters: any;
}

export interface RequestCreateMediaRoom {
  host: string;
  roomId: string;
}

export interface RequestPostMediaTrack {
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

export interface RequestJoinMediaRoom {
  roomId: string;
  user: string;
}

export interface RequestCreateTransport {
  roomId: string;
  speaker: string;
}

export interface RequestConnectMediaTransport {
  transportId: string;
  dtlsParameters: any;
  direction: MediaDirection;
  mediaKind?: any;
  roomId: string;
  user: string;
}

export interface RequestRecvTracks {
  stream: string;
  user: string;
  rtpCapabilities: any;
  mediaPermissionsToken: string;
}

export interface RequestConnectMediaServer {
  node: string;
  ip: string;
  port: number;
  srtp?: any;
}

export interface RequestCreateProducer {
  id: string;
  kind: MediaKind;
  rtpParameters: any;
  rtpCapabilities: any;
  appData: any;
  roomId: string;
  userId: string;
  sendTrackToUser?: boolean;
}

export interface RequestMediaNodeRegister {
  id: string;
  role: MediaServiceRole;
}

export interface RequestViewers {
  user: string;
  stream: string;
  page: number;
}

export interface RequestWhoAmI {
  user: string;
}

export interface RequestCreateStream {
  user: string;
  title: string;
  category: string;
}

export interface RequestJoinStream {
  stream: string;
  user: string;
}

export interface RequestStopStream {
  stream: string;
  user: string;
}

export interface IUserDisconnected {
  user: string;
}

export interface RequestRaiseHand {
  user: string;
  flag: boolean;
}

export interface RequestFeed {
  user: string;
  category?: string;
}

export interface RequestCreateUser {
  username: string;
  last_name: string;
  first_name: string;
  avatar: string;
  email: string;
  kind: "dev" | "apple" | "google" | "twitter" | "facebook";
}

export interface RequestActiveSpeakers {
  speakers: Record<string, { user: string; volume: number }[]>;
}

export interface RequestDeleteUser {
  user: string;
}

export interface RequestRecord {
  remoteRtpPort: number;
  localRtcpPort?: number;
  rtpCapabilities: any;
  rtpParameters: any;
  stream: string;
  user: string;
}

export interface RequestPostReaction {
  user: string;
  emoji: string;
  stream: string;
}

export interface RequestCreateFollow {
  user: string;
  userToFollow: string;
}

export interface RequestDeleteFollow {
  user: string;
  userToUnfollow: string;
}

export interface RequestSendChatMessage {
  user: string;
  message: string;
}

export interface RequestKickUser {
  user: string;
  userToKick: string;
}

export interface RequestReportUser {
  reportedUserId: string;
  reportReasonId: string;
  user: string;
}

export interface RequestBlockUser {
  userToBlock: string;
  user: string;
}

export interface RequestCreateInvite {
  invitee: string;
  stream?: string;
  user: string;
}

export interface RequestInviteSuggestions {
  user: string;
  stream: string;
}

export interface RequestUserSearch {
  textToSearch: string;
  user: string;
}

export interface RequestCancelInvite {
  user: string;
  invite_id: string;
}

export interface RequestReadNotifications {
  user: string;
}

export interface RequestFetchUnreadNotifications {
  user: string;
}

export interface RequestFetchReadNotifications {
  user: string;
  page: number;
}

export interface RequestGifs {
  search?: string;
  next?: string;
}

export interface RequestSetRole {
  user: string;
  userToUpdate: string;
  role: Roles;
}

export interface RequestRemoveUserProducers {
  user: string;
  stream: string;
  producers: {
    audio?: boolean;
    video?: boolean;
  };
}

export interface RequestMediaToggle {
  user: string;
  videoEnabled?: boolean;
  audioEnabled?: boolean;
}

export interface RequesJoinBot {
  user: string;
  inviteDetailsToken: string;
}

export interface RequestUpdateUser {
  user: string;
  data: Partial<User>;
}

export interface RequestUser {
  user: string;
  id: string;
}

export interface RequestInviteAction {
  user: string;
  invite: string;
  action: "accept" | "decline";
}

export interface RequestUserList {
  user: string;
  list: UserList;
  page: number;
}

export interface RequestFetchCoinBalance {
  user: string;
}

export interface RequestSendAward {
  user: string;
  message: string;
  visual: string;
  recipent: string;
}

export interface RequestFetchReceivedAwards {
  target: string;
}

export interface RequestAppInvite {
  user_id: string;
}

export interface RequestApplyInvite {
  user: string;
  code: string;
}

export interface RequestFetchStream {
  stream: string;
}

export interface RequestLeaveStream {
  user: string;
  stream: string;
}

export interface RequestUserStatus {
  user: string;
}

export interface RequestFetchFriendFeed {
  user: string;
}

export interface RequestStreamSearch {
  textToSearch: string;
}

export interface RequestMediaNodeInfo {
  node: string;
  load: number;
  role: string;
}

export interface RequestHostReassign {
  host: string;
  user: string;
}
