import { MediaService } from "@backend/services";
import { INewMediaNode, MessageHandler } from "@warpy/lib";

export const onNewOnlineNode: MessageHandler<INewMediaNode> = async (data) => {
  const { id, role } = data;

  await MediaService.addNewNode(id, role);
};
