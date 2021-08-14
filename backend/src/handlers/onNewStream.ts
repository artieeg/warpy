import { MessageHandler, INewStream, INewStreamResponse } from "@warpy/lib";
import { StreamService } from "@backend/services";

export const onNewStream: MessageHandler<INewStream, INewStreamResponse> =
  async (params, respond) => {
    const { owner, title, hub } = params;
    try {
      const result = await StreamService.createNewStream(owner, title, hub);
      respond(result);
    } catch (e) {
      console.error(e);
    }
  };
