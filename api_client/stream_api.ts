import { APIModule, EventHandler } from "./types";
import {
  IActiveSpeakerEvent,
  IReactionsUpdate,
  IJoinStreamResponse,
  INewStreamResponse,
  IRequestViewersResponse,
  ISpeakingAllowedEvent,
  IChatMessagesEvent,
  ISendMessageResponse,
  IUserKickedEvent,
  IInviteSuggestionsResponse,
  IInviteResponse,
} from "@warpy/lib";

export interface IStreamAPI {
  create: (title: string, hub: string) => Promise<INewStreamResponse>;
  join: (stream: string) => Promise<IJoinStreamResponse>;
  react: (stream: string, emoji: string) => void;
  stop: (stream: string) => any;
  sendChatMessage: (message: string) => Promise<ISendMessageResponse>;
  kickUser: (userToKick: string) => void;
  getViewers: (
    stream: string,
    page: number
  ) => Promise<IRequestViewersResponse>;
  raiseHand: () => any;
  invite: (invitee: string, stream: string) => Promise<IInviteResponse>;
  getInviteSuggestions: (stream: string) => Promise<IInviteSuggestionsResponse>;
  allowSpeaker: (speaker: string) => any;
  onReactionsUpdate: EventHandler<IReactionsUpdate>;
  onNewViewer: EventHandler;
  onNewRaisedHand: EventHandler;
  onUserLeft: EventHandler;
  onNewSpeaker: EventHandler;
  onSpeakingAllowed: EventHandler<ISpeakingAllowedEvent>;
  onActiveSpeaker: EventHandler<IActiveSpeakerEvent>;
  onChatMessages: EventHandler<IChatMessagesEvent>;
  onUserKick: EventHandler<IUserKickedEvent>;
}

export const StreamAPI: APIModule<IStreamAPI> = (socket) => ({
  create: (title, hub) =>
    socket.request("stream-new", {
      title,
      hub,
    }),
  invite: (invitee, stream) =>
    socket.request("invite-user", { invitee, stream }),
  getInviteSuggestions: (stream) =>
    socket.request("invite-suggestions", { stream }),
  kickUser: (userToKick) => socket.publish("kick-user", { userToKick }),
  stop: (stream) => socket.publish("stream-stop", { stream }),
  react: (stream, emoji) => socket.publish("reaction", { stream, emoji }),
  sendChatMessage: (message: string) =>
    socket.request("new-chat-message", { message }),
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
  onReactionsUpdate: (handler) => socket.on("reactions-update", handler),
  onChatMessages: (handler) => socket.on("chat-messages", handler),
  onUserKick: (handler) => socket.on("user-kicked", handler),
});
