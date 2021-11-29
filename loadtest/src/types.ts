import { APIClient } from "@warpy/api";
import { IBaseUser, Roles } from "@warpy/lib";
import { Device } from "mediasoup-client";
import { MediaClient } from "@warpy/media";
import { Consumer, Producer } from "mediasoup-client/lib/types";

export type UserRecord = {
  user: IBaseUser;
  api: APIClient;
  stream?: string;
  role?: Roles;

  recvDevice: Device;
  sendDevice: Device;

  media?: ReturnType<typeof MediaClient>;
  consumers?: Consumer[];
  producers?: Producer[];
};
