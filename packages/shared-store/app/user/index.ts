import { Roles, UserList } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { RoleUpdater, RoleUpdaterImpl } from "./RoleUpdater";
import {
  StreamPermissionRequester,
  StreamPermissionRequesterImpl,
} from "./StreamPermissionRequester";
import { UserDataLoader, UserDataLoaderImpl } from "./UserDataLoader";
import { UserFollower, UserFollowerImpl } from "./UserFollower";
import { UserListFetcher, UserListFetcherImpl } from "./UserListFetcher";

export class UserService
  implements
    UserDataLoader,
    RoleUpdater,
    StreamPermissionRequester,
    UserFollower,
    UserListFetcher
{
  private loader: UserDataLoader;
  private roleUpdater: RoleUpdater;
  private streamPermissionRequester: StreamPermissionRequester;
  private follower: UserFollowerImpl;
  private listFetcher: UserListFetcher;

  constructor(state: IStore | AppState) {
    this.loader = new UserDataLoaderImpl(state);
    this.roleUpdater = new RoleUpdaterImpl(state);
    this.streamPermissionRequester = new StreamPermissionRequesterImpl(state);
    this.follower = new UserFollowerImpl(state);
    this.listFetcher = new UserListFetcherImpl(state);
  }

  fetchUserList(list: UserList) {
    return this.listFetcher.fetchUserList(list);
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

  follow(newFollowedUser: string) {
    return this.follower.follow(newFollowedUser);
  }

  unfollow(userToUnfollow: string) {
    return this.follower.unfollow(userToUnfollow);
  }
}
