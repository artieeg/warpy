import { Consumer, PipeTransport } from "mediasoup/node/lib/types";

export type MediaDirection = "send" | "recv";
export type EgressTransports = Record<string, PipeTransport>;
export type PipeConsumers = Record<string, Consumer>;
