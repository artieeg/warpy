export type MediaServiceRole = "PRODUCER" | "CONSUMER" | "BOTH";
export type MediaDirection = "send" | "recv";

export type MessageRespondCallback<T> = (d: T) => void;
export type MessageHandler<Payload, Response = undefined> = (
  data: Payload,
  respond?: MessageRespondCallback<Response>
) => Promise<void>;
