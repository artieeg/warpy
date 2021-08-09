import { ParticipantService } from "@backend/services";
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

  const viewers = await ParticipantService.getViewersPage(stream, page);
  console.log(
    "viewres",
    viewers.map((i) => i.toJSON())
  );

  respond({
    viewers: viewers.map((i) => i.toJSON()),
  });
};
