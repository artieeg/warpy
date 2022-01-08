import {
  createPreviewsProducer,
  uploadPreview,
  sendNewPreview,
} from "@clipper/services";
import { IRecordRequest, MessageHandler } from "@warpy/lib";

export const onRecordRequest: MessageHandler<IRecordRequest> = async (data) => {
  const { stream } = data;

  const previewProducer = createPreviewsProducer(data);

  previewProducer.onNewPreview(async ({ directory, filename }) => {
    //const previewFileName = await uploadPreview(directory + filename);

    //sendNewPreview(stream, previewFileName);
    //console.log("Produced new preview", previewFileName);

    console.log("DEBUG: new preview readu to be uploaded", { filename });

    //previewProducer.removePreview({ directory, filename });
  });
};
