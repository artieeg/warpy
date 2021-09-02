import { APIModule, EventHandler } from "./types";
import {
  IActiveSpeakerEvent,
  IReactionsUpdate,
  IJoinStreamResponse,
  INewStreamResponse,
  IRequestViewersResponse,
  ISpeakingAllowedEvent,
} from "@warpy/lib";

export interface IStreamAPI {
  create: (title: string, hub: string) => Promise<INewStreamResponse>;
  join: (stream: string) => Promise<IJoinStreamResponse>;
  react: (stream: string, emoji: string) => void;
  stop: (stream: string) => any;
  getViewers: (
    stream: string,
    page: number
  ) => Promise<IRequestViewersResponse>;
  raiseHand: () => any;
  allowSpeaker: (speaker: string) => any;
  onReactionsUpdate: EventHandler<IReactionsUpdate>;
  onNewViewer: EventHandler;
  onNewRaisedHand: EventHandler;
  onUserLeft: EventHandler;
  onNewSpeaker: EventHandler;
  onSpeakingAllowed: EventHandler<ISpeakingAllowedEvent>;
  onActiveSpeaker: EventHandler<IActiveSpeakerEvent>;
}

export const StreamAPI: APIModule<IStreamAPI> = (socket) => ({
  create: (title, hub) =>
    socket.request("stream-new", {
      title,
      hub,
    }),
  stop: (stream) => socket.publish("stream-stop", { stream }),
  react: (stream, emoji) => socket.publish("reaction", { stream, emoji }),
  join: (stream) => socket.request("join-stream", { stream }),
  getViewers: (stream, page) =>
    socket.request("request-viewers", { stream, page }),
  raiseHand: () => socket.publish("raise-hand", {}),
  allowSpeaker: (speaker) => socket.publish("speaker-allow", { speaker }),
  onNewViewer: (handler) => socket.on("new-viewer", handler),
  onNewRaisedHand: (handler) => socket.on("raise-hand", handler),
  onUserLeft: (handler) => socket.on("user-left", handler),
  onNewSpeaker: (handler) => socket.on("new-speaker", handler),
  onActiveSpeaker: (handler) => socket.on("active-speaker", handler),
  onSpeakingAllowed: (handler) => socket.on("speaking-allowed", handler),
  onReactionsUpdate: (handler) => socket.on("claps-update", handler),
});
