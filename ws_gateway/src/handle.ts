import { Context, HandlerConfig } from "@ws_gateway/types";
import { MessageService } from "./services";

type HandleParams = {
  data: any;
  context: Context;
  rid?: string;
  handler: HandlerConfig;
  event: string;
};

export const handle = async ({ data, context, rid, handler }: HandleParams) => {
  const { ws } = context;
  const { subject, schema, auth, customHandler, kind } = handler;

  const { error: schemaValidationError } = schema.validate(data);

  if (schemaValidationError) {
    console.log("invalid schema", data, schemaValidationError);
    //TODO: ws.send error
    return;
  }

  if (auth && !context.user) {
    console.log("not authed");

    //TODO: ws.send error
    return;
  }

  let payload = {
    ...data,
    user: auth ? context.user : undefined,
  };

  if (!subject && !customHandler) {
    throw new Error("Specify a subject or a custom handler");
  }

  if (!subject) {
    if (customHandler) {
      await customHandler(data, context, rid);
    }
  } else {
    if (kind === "event") {
      MessageService.sendBackendMessage(subject, payload);
    } else if (kind === "request") {
      const response = await MessageService.sendBackendRequest(
        subject,
        payload
      );

      ws.send(
        JSON.stringify({
          event: "@api/response",
          data: response,
          rid,
        })
      );
    }
  }
};
