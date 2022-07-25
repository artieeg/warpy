import { GetState, SetState } from "zustand";
import { AppActionDispatcher } from "../dispatch";
import { IAPISlice } from "../slices/createAPISlice";
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

export interface IStore
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
    IAPISlice,
    AppActionDispatcher {
  set: SetState<IStore>;
  get: GetState<IStore>;
}
