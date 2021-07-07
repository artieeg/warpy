import { Subscription } from "nats";
import WebSocket from "ws";

export type Handlers = { [key: string]: (data: any) => Promise<void> };

export type Handler = (data: any, context?: Context) => any;

export type Context = {
  user?: string;
  ws: WebSocket;
  sub?: Subscription;
};
