import {
  AppInviteData,
  ChatData,
  FeedData,
  InviteData,
  MediaData,
  ModalData,
  NotificationData,
  StreamData,
  ToastData,
  UserData,
  AwardData,
  ApiData,
} from "./services";

export interface Store
  extends AppInviteData,
    ApiData,
    ChatData,
    FeedData,
    InviteData,
    MediaData,
    AwardData,
    ModalData,
    NotificationData,
    StreamData,
    ToastData,
    UserData {}
