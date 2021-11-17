export type MediaServiceRole = "PRODUCER" | "CONSUMER" | "BOTH";
export type MediaDirection = "send" | "recv";
export type Roles = "streamer" | "speaker" | "viewer";
export type MediaKind = "audio" | "video";

export type MessageRespondCallback<T> = (d: T) => void;
export type MessageHandler<Payload, Response = undefined> = (
  data: Payload,
  respond: MessageRespondCallback<Response>
) => Promise<void> | void;

export interface Message {
  [key: string]: string | number | object;
}

export interface Response {
  [key: string]: string | number | object;
}

export type Reaction = {
  user: string;
  emoji: string;
};

export type InviteStates = "unknown" | "accepted" | "declined";

export type UserList = "blocked" | "following" | "followers";
