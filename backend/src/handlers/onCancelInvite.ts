import {
  MessageHandler,
  ICancelInviteRequest,
  ICancelInviteResponse,
} from "@warpy/lib";
import { InviteService } from "@backend/services";

export const onCancelInvite: MessageHandler<
  ICancelInviteRequest,
  ICancelInviteResponse
> = async (data, respond) => {
  console.log("cancel invitel", data);
  await InviteService.deleteInvite(data.user, data.invite_id);

  respond({
    status: "ok",
  });
};
