import { StreamDAL } from "@backend/dal";
import { INewPreviewEvent, MessageHandler } from "@warpy/lib";

//TODO: move to service

export const onNewStreamPreview: MessageHandler<INewPreviewEvent> = async (
  data
) => {
  const { stream, preview } = data;

  await StreamDAL.setPreviewClip(stream, preview);
};
