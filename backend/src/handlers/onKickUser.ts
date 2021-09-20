import { StreamService } from "@backend/services";
import { IKickUserRequest, MessageHandler } from "@warpy/lib";

export const onKickUser: MessageHandler<IKickUserRequest> = async (data) => {
  const { user, userToKick } = data;

  await StreamService.kickFromStream({
    user,
    userToKick,
  });
};
