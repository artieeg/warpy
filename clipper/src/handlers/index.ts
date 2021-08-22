import { IRecordRequest, MessageHandler } from "@warpy/lib";
import { producePreviewClips } from "../services";

export const onRecordRequest: MessageHandler<IRecordRequest> = async (data) => {
  producePreviewClips({
    localRtcpPort: data.localRtcpPort,
    remoteRtpPort: data.remoteRtpPort,
    rtpParameters: data.rtpParameters,
    rtpCapabilities: data.rtpCapabilities,
  });
};
