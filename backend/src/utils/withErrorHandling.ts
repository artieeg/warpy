import { MessageHandler } from "@warpy/lib";
import { InternalError } from "@backend/errors";
import * as errors from "@backend/errors";

type Handler = MessageHandler<any, any>;

const knownErrorList = Object.values(errors);

const filterUnknownErrors = (error: Error) => {
  const isKnownError = knownErrorList.some((e) => error instanceof e);

  if (isKnownError) {
    return error;
  } else {
    console.error(error);

    return new InternalError();
  }
};

export const withErrorHandling = (fn: Handler) => {
  const handler: Handler = async (data, respond) => {
    try {
      await fn(data, respond);
    } catch (error) {
      const filteredError = filterUnknownErrors(error);

      respond({
        status: "error",
        error: filteredError,
      });
    }
  };

  return handler;
};
