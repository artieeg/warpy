import { AppActionRunner } from "./AppActionRunner";

export type MediaDirection = "send" | "recv";
export type ParticipantRole = "streamer" | "speaker" | "viewer";

export type DURATION = "LONG" | "SHORT";

type AppServices = ReturnType<typeof AppActionRunner.prototype.getServices>;

export type StoreSlice<T> = () => T;

export type StoreDispatcherSlice<T> = (
  runner: AppActionRunner,
  services: AppServices
) => T;
