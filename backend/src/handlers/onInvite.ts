import { InviteService } from "@backend/services/invite";
import { IInviteRequest, IInviteResponse, MessageHandler } from "@warpy/lib";

export const onInvite: MessageHandler<IInviteRequest, IInviteResponse> = async (
  data,
  respond
) => {
  const { user, stream, invitee } = data;

  const invite = await InviteService.createStreamInvite({
    inviter: user,
    invitee,
    stream,
  });

  respond({
    invite,
  });
};
