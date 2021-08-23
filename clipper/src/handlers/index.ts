import { createPreviewsProducer } from "@clipper/services";
import { uploadPreview } from "@clipper/services/preview_storage";
import { IRecordRequest, MessageHandler } from "@warpy/lib";

export const onRecordRequest: MessageHandler<IRecordRequest> = async (data) => {
  const previewProducer = createPreviewsProducer({
    localRtcpPort: data.localRtcpPort,
    remoteRtpPort: data.remoteRtpPort,
    rtpParameters: data.rtpParameters,
    rtpCapabilities: data.rtpCapabilities,
  });

  previewProducer.onNewPreview(async ({ directory, filename }) => {
    console.log("new preview is ready", directory, filename);

    const previewFileName = await uploadPreview(directory + filename);

    console.log(previewFileName);
  });
};
