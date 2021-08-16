import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/types";
import { ConsumeRemoteStreams } from "./types";
import { APIClient } from "@warpy/api";

export const consumeRemoteStreamsFactory =
  (
    api: APIClient,
    recvDevice: Device,
    permissionsToken: string | null
  ): ConsumeRemoteStreams =>
  async (user, stream, transport) => {
    const { consumerParams } = await api.media.getRecvTracks({
      rtpCapabilities: recvDevice.rtpCapabilities,
      stream,
      mediaPermissionsToken: permissionsToken,
    });

    const consumersPromises: Promise<Consumer>[] = consumerParams.map(
      (params: any) =>
        transport.consume({
          ...params.consumerParameters,
          appData: {
            user,
            producerId: params.consumerParameters.producerId,
            mediaTag: "media-" + Math.random(),
          },
        })
    );

    const consumers = await Promise.all(consumersPromises);

    return consumers;
  };
