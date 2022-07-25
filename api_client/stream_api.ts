import { APIModule, EventHandler } from "./types";
import {
  EventActiveSpeaker,
  EventNewReactions,
  IJoinStreamResponse,
  INewStreamResponse,
  IRequestViewersResponse,
  EventRoleUpdate,
  EventChatMessages,
  ISendMessageResponse,
  EventKickedUser,
  IInviteSuggestionsResponse,
  IInviteResponse,
  ICancelInviteResponse,
  Roles,
  EventParticipantRoleChange,
  EventMediaToggle,
  EventNewParticipant,
  EventStreamIdAvailable,
  EventInviteStateUpdate,
  ILeaveStreamResponse,
  IStreamSearchResponse,
  EventPreviousStream,
  EventReassignedStreamHost,
  EventStreamEnd,
  EventReceivedInvite,
} from "@warpy/lib";

export interface IStreamAPI {
  create: (title: string, hub: string) => Promise<INewStreamResponse>;
  join: (stream: string) => Promise<IJoinStreamResponse>;
  search: (text: string) => Promise<IStreamSearchResponse>;
  react: (stream: string, emoji: string) => void;
  stop: (stream: string) => any;
  sendChatMessage: (message: string) => Promise<ISendMessageResponse>;
  sendInviteAction: (invite: string, action: "accept" | "decline") => void;
  kickUser: (userToKick: string) => void;
  reassignHost: (host: string) => Promise<void>;
  toggleMedia: (payload: {
    audioEnabled?: boolean;
    videoEnabled?: boolean;
  }) => Promise<void>;
  getViewers: (
    stream: string,
    page: number
  ) => Promise<IRequestViewersResponse>;
  raiseHand: () => any;
  lowerHand: () => any;
  invite: (invitee: string, stream: string | null) => Promise<IInviteResponse>;
  cancelInvite: (invite_id: string) => Promise<ICancelInviteResponse>;
  getInviteSuggestions: (stream: string) => Promise<IInviteSuggestionsResponse>;
  setRole: (userToUpdate: string, role: Roles) => void;
  leave: (stream: string) => Promise<ILeaveStreamResponse>;
  onPreviousStream: EventHandler<EventPreviousStream>;
  onReactionsUpdate: EventHandler<EventNewReactions>;
  onNewParticipant: EventHandler<EventNewParticipant>;
  onRaiseHandUpdate: EventHandler;
  onUserLeft: EventHandler;
  onParticipantRoleChange: EventHandler<EventParticipantRoleChange>;
  onRoleUpdate: EventHandler<EventRoleUpdate>;
  onInviteStateUpdate: EventHandler<EventInviteStateUpdate>;
  onActiveSpeaker: EventHandler<EventActiveSpeaker>;
  onChatMessages: EventHandler<EventChatMessages>;
  onUserKick: EventHandler<EventKickedUser>;
  onMediaToggle: EventHandler<EventMediaToggle>;
  onStreamIdAvailable: EventHandler<EventStreamIdAvailable>;
  onHostReassign: EventHandler<EventReassignedStreamHost>;
  onStreamEnd: EventHandler<EventStreamEnd>;
  onNewInvite: EventHandler<EventReceivedInvite>;
}

export const StreamAPI: APIModule<IStreamAPI> = (socket) => ({
  leave: (stream) => socket.request("leave-stream", { stream }),
  create: (title, category) =>
    socket.request("stream-new", {
      title,
      category,
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
  sendInviteAction: (invite, action) =>
    socket.publish("invite-action", { invite, action }),
  react: (stream, emoji) => socket.publish("reaction", { stream, emoji }),
  sendChatMessage: (message: string) =>
    socket.request("new-chat-message", { message }),
  search: (textToSearch) => socket.request("search-stream", { textToSearch }),
  reassignHost: (host) => socket.request("host-reassign", { host }),
  join: (stream) => socket.request("join-stream", { stream }),
  getViewers: (stream, page) =>
    socket.request("request-viewers", { stream, page }),
  lowerHand: () =>
    socket.publish("raise-hand", {
      flag: false,
    }),
  raiseHand: () =>
    socket.publish("raise-hand", {
      flag: true,
    }),
  setRole: (userToUpdate, role) =>
    socket.publish("set-role", { userToUpdate, role }),
  onNewParticipant: (handler) => socket.on("new-participant", handler),
  onNewInvite: (handler) => socket.on("new-invite", handler),
  onHostReassign: (handler) => socket.on("stream-host-reassigned", handler),
  onPreviousStream: (handler) => socket.on("previous-stream", handler),
  onInviteStateUpdate: (handler) => socket.on("invite-state-update", handler),
  onRaiseHandUpdate: (handler) => socket.on("raise-hand", handler),
  onUserLeft: (handler) => socket.on("user-left", handler),
  onStreamIdAvailable: (handler) => socket.on("stream-id-available", handler),
  onParticipantRoleChange: (handler) =>
    socket.on("participant-role-change", handler),
  onActiveSpeaker: (handler) => socket.on("active-speaker", handler),
  onRoleUpdate: (handler) => socket.on("role-change", handler),
  onReactionsUpdate: (handler) => socket.on("reactions-update", handler),
  onChatMessages: (handler) => socket.on("chat-messages", handler),
  onUserKick: (handler) => socket.on("user-kicked", handler),
  onMediaToggle: (handler) => socket.on("user-toggled-media", handler),
  onStreamEnd: (handler) => socket.on("stream-end", handler),
});
