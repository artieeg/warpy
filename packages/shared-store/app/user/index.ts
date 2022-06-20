import { Roles } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { RoleUpdater, RoleUpdaterImpl } from "./RoleUpdater";
import {
  StreamPermissionRequester,
  StreamPermissionRequesterImpl,
} from "./StreamPermissionRequester";
import { UserDataLoader, UserDataLoaderImpl } from "./UserDataLoader";

export class UserService
  implements UserDataLoader, RoleUpdater, StreamPermissionRequester
{
  private loader: UserDataLoader;
  private roleUpdater: RoleUpdater;
  private streamPermissionRequester: StreamPermissionRequester;

  constructor(state: IStore | AppState) {
    this.loader = new UserDataLoaderImpl(state);
    this.roleUpdater = new RoleUpdaterImpl(state);
    this.streamPermissionRequester = new StreamPermissionRequesterImpl(state);
  }

  loadUserData(access_token: string) {
    return this.loader.loadUserData(access_token);
  }

  updateUserRole(params: {
    role: Roles;
    mediaPermissionToken: string;
    sendMediaParams: any;
  }) {
    return this.roleUpdater.updateUserRole(params);
  }

  requestStreamPermission() {
    return this.streamPermissionRequester.requestStreamPermission();
  }
}
