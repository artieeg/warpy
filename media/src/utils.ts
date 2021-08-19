import jwt from "jsonwebtoken";
import { IMediaPermissions, ITransportOptions } from "@warpy/lib";
import { WebRtcTransport } from "mediasoup/lib/types";

export const getMediaPermissions = (token: string) => {
  return jwt.verify(token, process.env.MEDIA_JWT_SECRET!) as IMediaPermissions;
};

export const isAudioAllowed = (permissions: IMediaPermissions) => {
  return permissions.audio;
};

export const isVideoAllowed = (permissions: IMediaPermissions) => {
  return permissions.video;
};

export const getOptionsFromTransport = (
  transport: WebRtcTransport
): ITransportOptions => ({
  id: transport.id,
  iceParameters: transport.iceParameters,
  iceCandidates: transport.iceCandidates,
  dtlsParameters: transport.dtlsParameters,
});
