import { INewPreviewEvent, MessageHandler } from "@warpy/lib";
import { CandidateDAL } from "@backend/dal";

export const onNewStreamPreview: MessageHandler<INewPreviewEvent> = async (
  data
) => {
  const { stream, preview } = data;

  await CandidateDAL.setPreviewClip(stream, preview);
};
