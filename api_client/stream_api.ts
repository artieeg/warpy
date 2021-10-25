import { APIModule, EventHandler } from "./types";
import {
  IActiveSpeakerEvent,
  IReactionsUpdate,
  IJoinStreamResponse,
  INewStreamResponse,
  IRequestViewersResponse,
  IRoleUpdateEvent,
  IChatMessagesEvent,
  ISendMessageResponse,
  IUserKickedEvent,
  IInviteSuggestionsResponse,
  IInviteResponse,
  ICancelInviteResponse,
  Roles,
  IParticipantRoleChangeEvent,
  IMediaToggleEvent,
} from "@warpy/lib";

export interface IStreamAPI {
  create: (title: string, hub: string) => Promise<INewStreamResponse>;
  join: (stream: string) => Promise<IJoinStreamResponse>;
  react: (stream: string, emoji: string) => void;
  stop: (stream: string) => any;
  sendChatMessage: (message: string) => Promise<ISendMessageResponse>;
  kickUser: (userToKick: string) => void;
  toggleMedia: (payload: {
    audioEnabled?: boolean;
    videoEnabled?: boolean;
  }) => Promise<void>;
  getViewers: (
    stream: string,
    page: number
  ) => Promise<IRequestViewersResponse>;
  raiseHand: () => any;
  invite: (invitee: string, stream: string) => Promise<IInviteResponse>;
  cancelInvite: (invite_id: string) => Promise<ICancelInviteResponse>;
  getInviteSuggestions: (stream: string) => Promise<IInviteSuggestionsResponse>;
  setRole: (userToUpdate: string, role: Roles) => void;
  allowSpeaker: (speaker: string) => any;
  onReactionsUpdate: EventHandler<IReactionsUpdate>;
  onNewViewer: EventHandler;
  onNewRaisedHand: EventHandler;
  onUserLeft: EventHandler;
  onParticipantRoleChange: EventHandler<IParticipantRoleChangeEvent>;
  onRoleUpdate: EventHandler<IRoleUpdateEvent>;
  onActiveSpeaker: EventHandler<IActiveSpeakerEvent>;
  onChatMessages: EventHandler<IChatMessagesEvent>;
  onUserKick: EventHandler<IUserKickedEvent>;
  onMediaToggle: EventHandler<IMediaToggleEvent>;
}

export const StreamAPI: APIModule<IStreamAPI> = (socket) => ({
  create: (title, hub) =>
    socket.request("stream-new", {
      title,
      hub,
    }),
  toggleMedia: ({
    audioEnabled,
    videoEnabled,
  }: {
    audioEnabled?: boolean;
    videoEnabled?: boolean;
  }) => socket.request("media-toggle", { audioEnabled, videoEnabled }),
  invite: (invitee, stream) =>
    socket.request("invite-user", { invitee, stream }),
  cancelInvite: (invite_id) =>
    socket.request("cancel-stream-invite", { invite_id }),
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
  setRole: (userToUpdate, role) =>
    socket.publish("set-role", { userToUpdate, role }),
  allowSpeaker: (speaker) => socket.publish("speaker-allow", { speaker }),
  onNewViewer: (handler) => socket.on("new-viewer", handler),
  onNewRaisedHand: (handler) => socket.on("raise-hand", handler),
  onUserLeft: (handler) => socket.on("user-left", handler),
  onParticipantRoleChange: (handler) =>
    socket.on("participant-role-change", handler),
  onActiveSpeaker: (handler) => socket.on("active-speaker", handler),
  onRoleUpdate: (handler) => socket.on("role-change", handler),
  onReactionsUpdate: (handler) => socket.on("reactions-update", handler),
  onChatMessages: (handler) => socket.on("chat-messages", handler),
  onUserKick: (handler) => socket.on("user-kicked", handler),
  onMediaToggle: (handler) => socket.on("user-toggled-media", handler),
});
