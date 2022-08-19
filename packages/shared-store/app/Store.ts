import { IAPISlice } from "../APISlice";
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
} from "./services";

export interface Store
  extends AppInviteData,
    ChatData,
    FeedData,
    InviteData,
    MediaData,
    AwardData,
    ModalData,
    NotificationData,
    StreamData,
    ToastData,
    UserData,
    IAPISlice {}
