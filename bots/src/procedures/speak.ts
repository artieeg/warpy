import { MediaClient } from "@warpykit-sdk/client";
import { getAudioStream } from "../media";
import { UserRecord } from "../types";

export const speak = (record: UserRecord) => {
  const { stream, api } = record;

  api.stream.raiseHand();

  api.stream.onSpeakingAllowed(async (data) => {
    const { media, mediaPermissionToken } = data;

    record.media = MediaClient({
      recvDevice: record.recvDevice,
      sendDevice: record.sendDevice,
      permissionsToken: mediaPermissionToken,
      api,
    });

    const audio = await getAudioStream();

    const { routerRtpCapabilities, sendTransportOptions } = media;

    await record.sendDevice.load({ routerRtpCapabilities });

    const sendTransport = await record.media.createTransport({
      roomId: stream!,
      device: record.sendDevice,
      permissionsToken: mediaPermissionToken,
      direction: "send",
      options: {
        sendTransportOptions: sendTransportOptions,
      },
      isProducer: true,
    });

    const producer = await record.media.sendMediaStream(
      audio,
      media,
      sendTransport
    );

    record.producers = [producer];
  });
};
