import { GetState, SetState } from "zustand";
import { IStore } from "./useStore";

export type MediaDirection = "send" | "recv";
export type ParticipantRole = "streamer" | "speaker" | "viewer";

export type Modal =
  | "user-actions"
  | "award"
  | "award-recipent"
  | "participant-info"
  | "participants"
  | "reactions"
  | "reports"
  | "invite"
  | "stream-invite"
  | "bot-confirm"
  | "chat";

export type DURATION = "LONG" | "SHORT";

export type StoreSlice<T> = (set: SetState<IStore>, get: GetState<IStore>) => T;
