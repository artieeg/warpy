import jwt from "jsonwebtoken";
import { MediaPermissions } from "@warpy/lib";

export const verifyMediaPermissions = (token: string) => {
  return jwt.verify(token, process.env.MEDIA_JWT_SECRET!) as MediaPermissions;
};
