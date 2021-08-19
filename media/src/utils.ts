import jwt from "jsonwebtoken";
import { IMediaPermissions, ITransportOptions } from "@warpy/lib";
import { WebRtcTransport } from "mediasoup/lib/types";

export const getMediaPermissions = (token: string) => {
  return jwt.verify(token, process.env.MEDIA_JWT_SECRET!) as IMediaPermissions;
};

export const verifyMediaPermissions = (
  token: string,
  fieldsToCheck: Partial<IMediaPermissions>
) => {
  const permissions: any = getMediaPermissions(token);

  Object.entries(fieldsToCheck).forEach(([field, value]) => {
    if (permissions[field] !== value) {
      throw new Error();
    }
  });

  return permissions;
};

export const getOptionsFromTransport = (
  transport: WebRtcTransport
): ITransportOptions => ({
  id: transport.id,
  iceParameters: transport.iceParameters,
  iceCandidates: transport.iceCandidates,
  dtlsParameters: transport.dtlsParameters,
});
