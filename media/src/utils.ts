import jwt from "jsonwebtoken";
import { IMediaPermissions } from "@warpy/lib";

export const getMediaPermissions = (token: string) => {
  return jwt.verify(token, process.env.MEDIA_JWT_SECRET!) as IMediaPermissions;
};

export const isAudioAllowed = (permissions: IMediaPermissions) => {
  return permissions.audio;
};

export const isVideoAllowed = (permissions: IMediaPermissions) => {
  return permissions.video;
};
