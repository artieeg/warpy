import { APIClient } from "@warpy/api";
import { IBaseUser, Roles } from "@warpy/lib";

export type UserRecord = {
  user: IBaseUser;
  api: APIClient;
  stream?: string;
  role?: Roles;
};
