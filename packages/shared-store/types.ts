import { GetState, SetState } from "zustand";
import { AppActionRunner } from "./AppActionRunner";
import { IStore } from "./useStore";

export type MediaDirection = "send" | "recv";
export type ParticipantRole = "streamer" | "speaker" | "viewer";

export type DURATION = "LONG" | "SHORT";

type AppServices = ReturnType<typeof AppActionRunner.prototype.getServices>;

export type StoreSlice<T> = (set: SetState<IStore>, get: GetState<IStore>) => T;

export type StoreSlice2<T> = (
  runner: AppActionRunner,
  services: AppServices
) => T;
