import { BlockService } from "@backend/services";
import {
  IUserBlockRequest,
  IUserBlockResponse,
  MessageHandler,
} from "@warpy/lib";

export const onUserBlock: MessageHandler<
  IUserBlockRequest,
  IUserBlockResponse
> = async (data, respond) => {
  const { user, userToBlock } = data;

  const blockId = await BlockService.blockUser(user, userToBlock);

  respond({
    blockId,
  });
};
