import { MediaClient } from "@warpykit-sdk/client";
import { UserRecord } from "../types";
import { createRecvTransport } from "../utils";

export const joinStream = async (streamId: string, record: UserRecord) => {
  const { api, recvDevice, sendDevice } = record;

  const {
    speakers,
    count,
    raisedHands,
    mediaPermissionsToken,
    recvMediaParams,
  } = await record.api.stream.join(streamId);

  const { routerRtpCapabilities, recvTransportOptions } = recvMediaParams;

  console.log(`joined room with ${count} viewers`);

  record.media = MediaClient({
    recvDevice,
    sendDevice,
    permissionsToken: mediaPermissionsToken,
    api,
  });

  const transport = await createRecvTransport({
    stream: streamId,
    routerRtpCapabilities,
    recvTransportOptions,
    record,
  });

  if (process.env.MODE === "LOADTEST") {
    //TODO: Consuming VP8 streams causes memory leak in aiortc apparently
    const consumers = await record.media.consumeRemoteStreams(
      record.user.id,
      streamId,
      transport
    );

    record.consumers = consumers;
  }

  record.stream = streamId;
  record.role = "viewer";

  //Listen to new media tracks
  api.media.onNewTrack((data) => {
    record.media?.consumeRemoteStream(
      data.consumerParameters,
      data.user,
      transport
    );
  });
};
