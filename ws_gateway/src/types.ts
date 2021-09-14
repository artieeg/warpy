import { Subscription } from "nats";
import WebSocket from "ws";
import { IChatMessage } from "@warpy/lib";

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
  batchedChatMessages: IChatMessage[];
  messageSendInterval?: ReturnType<typeof setInterval>;
};
