import { Subscription } from "nats";
import WebSocket from "ws";
import { IChatMessage } from "@warpy/lib";
import { Schema } from "joi";

export type Handler = (
  data: any,
  context: Context,
  rid?: string
) => Promise<any>;

export type Handlers = {
  [key: string]: Handler;
};

export type Context = {
  user?: string;
  ws: WebSocket;
  sub?: Subscription;
  isBot?: boolean;
  batchedChatMessages: IChatMessage[];
  messageSendInterval?: ReturnType<typeof setInterval>;
};

export type HandlerConfig = {
  subject?: string;
  auth?: boolean;
  customHandler?: Handler;
  schema: Schema;

  /**
   * if "request", the handler will wait for the backend's response;
   * if "event", it will simply publish the message;
   * */
  kind?: "request" | "event";
};
