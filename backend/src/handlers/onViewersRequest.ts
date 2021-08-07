import { ParticipantService } from "@backend/services";
import { MessageHandler, IRequestViewers } from "@warpy/lib";

export const onViewersRequest: MessageHandler<IRequestViewers, any> = async (
  data,
  respond
) => {
  const { stream, page } = data;

  const viewers = await ParticipantService.getViewersPage(stream, page);

  respond({
    viewers,
  });
};
