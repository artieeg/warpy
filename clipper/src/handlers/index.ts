import { createPreviewsProducer } from "@clipper/services";
import { IRecordRequest, MessageHandler } from "@warpy/lib";

export const onRecordRequest: MessageHandler<IRecordRequest> = async (data) => {
  const previewProducer = createPreviewsProducer({
    localRtcpPort: data.localRtcpPort,
    remoteRtpPort: data.remoteRtpPort,
    rtpParameters: data.rtpParameters,
    rtpCapabilities: data.rtpCapabilities,
  });

  previewProducer.onNewPreview(({ directory, filename }) => {
    console.log("new preview is ready", directory, filename);
  });
};
