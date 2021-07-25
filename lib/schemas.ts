export type WebSocketEvent =
  | "user-join"
  | "raise-hand"
  | "allow-speaker"
  | "created-room"
  | "speaking-allowed"
  | "@media/recv-connect-params"
  | "@media/new-track"
  | "@media/send-transport-connected"
  | "@media/recv-transport-connected"
  | "@media/send-track-created"
  | "@media/recv-track-created"
  | "speaker-send-transport"
  | "recv-tracks-response";

export interface IParticipantJoinEvent {}
