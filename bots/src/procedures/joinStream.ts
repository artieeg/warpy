import { APIClient } from "@warpy/api";
import { MediaClient } from "@warpykit-sdk/client";
import { UserRecord } from "../types";
import { createRecvTransport } from "../utils";

type RoomParams = {
  routerRtpCapabilities: any;
  recvTransportOptions: any;
};

const waitForRoomParams = (api: APIClient) => {
  return new Promise<RoomParams>((resolve) => {
    api.media.onceRecvConnectParams(async (data) => {
      console.log("recv connect params", data);
      resolve({
        routerRtpCapabilities: data.routerRtpCapabilities,
        recvTransportOptions: data.recvTransportOptions,
      });
    });
  });
};

export const joinStream = async (streamId: string, record: UserRecord) => {
  const { api, recvDevice, sendDevice } = record;

  const [
    { routerRtpCapabilities, recvTransportOptions },
    { speakers, count, raisedHands, mediaPermissionsToken },
  ] = await Promise.all([
    waitForRoomParams(api),
    record.api.stream.join(streamId),
  ]);

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

  //TODO: Consuming VP8 streams causes memory leak in aiortc apparently
  const consumers = await record.media.consumeRemoteStreams(
    record.user.id,
    streamId,
    transport
  );

  record.consumers = consumers;
  record.stream = streamId;
  record.role = "viewer";

  //Listen to new media tracks
  api.media.onNewTrack((data) => {
    record.media.consumeRemoteStream(
      data.consumerParameters,
      data.user,
      transport
    );
  });
};
