import { MessageHandler, INewStream, INewStreamResponse } from "@warpy/lib";
import { StreamService } from "@backend/services";

export const onNewStream: MessageHandler<INewStream, INewStreamResponse> =
  async (params, respond) => {
    const { user, title, hub } = params;
    try {
      const result = await StreamService.createNewStream(user, title, hub);
      respond(result);
    } catch (e) {
      console.error(e);
    }
  };
