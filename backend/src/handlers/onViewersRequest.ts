import { StreamService } from "@backend/services";
import {
  MessageHandler,
  IRequestViewers,
  IRequestViewersResponse,
} from "@warpy/lib";

export const onViewersRequest: MessageHandler<
  IRequestViewers,
  IRequestViewersResponse
> = async (data, respond) => {
  const { stream, page } = data;

  const response = await StreamService.getViewers(stream, page);

  respond(response);
};
