import { startProducingPreviews } from "@clipper/services";
import { clips, createMediaRecorder } from "@clipper/services/recorder";
import { IRecordRequest, MessageHandler } from "@warpy/lib";

export const onRecordRequest: MessageHandler<IRecordRequest> = async (data) => {
  const { stream } = data;

  if (!clips[stream]) {
    clips[stream] = {};

    startProducingPreviews(stream);
  }

  //const previewProducer = createPreviewsProducer(data);

  const clipper = createMediaRecorder({
    recordParams: data,
    clip: {
      duration: 3000,
      interval: 30000,
    },
  });

  /*
  previewProducer.onNewPreview(async ({ directory, filename }) => {
    //const previewFileName = await uploadPreview(directory + filename);

    //sendNewPreview(stream, previewFileName);
    //console.log("Produced new preview", previewFileName);

    console.log("DEBUG: new preview readu to be uploaded", { filename });

    //previewProducer.removePreview({ directory, filename });
  });
  */
};
