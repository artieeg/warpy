import jwt from "jsonwebtoken";
import { IMediaPermissions } from "@warpy/lib";

export const verifyMediaPermissions = (token: string) => {
  return jwt.verify(token, process.env.MEDIA_JWT_SECRET!) as IMediaPermissions;
};
