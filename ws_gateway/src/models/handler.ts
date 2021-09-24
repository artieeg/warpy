import { Context } from "@ws_gateway/types";
import { Schema } from "joi";

export type Handler = {
  subject?: string;
  auth?: boolean;
  customHandler?: (data: any, context: Context, rid?: string) => Promise<any>;
  schema: Schema;

  /**
   * if "request", the handler will wait for the backend's response;
   * if "event", it will simply publish the message;
   * */
  kind: "request" | "event";
};
