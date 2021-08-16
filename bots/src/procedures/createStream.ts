import { MediaClient } from "../../../warpykit-sdk-client";
import { getMediaStream } from "../media";
import { UserRecord } from "../types";

export const createStream = async (record: UserRecord) => {
  const { user, api } = record;

  const title = `${user.first_name} ${user.last_name}'s stream`;
  const hub = "test";

  const response = await api.stream.create(title, hub);

  const { stream, media, mediaPermissionsToken } = response;
  const { routerRtpCapabilities } = media;

  record.media = MediaClient({
    api,
    recvDevice: record.recvDevice,
    sendDevice: record.sendDevice,
    permissionsToken: mediaPermissionsToken,
  } as any);

  await record.sendDevice.load({
    routerRtpCapabilities,
  });
  const localMediaStream = await getMediaStream();

  await Promise.all([
    record.media.sendMediaStream(localMediaStream, stream, media, "video"),
    record.media.sendMediaStream(localMediaStream, stream, media, "audio"),
  ]);

  record.stream = response.stream;
  record.role = "streamer";
};
