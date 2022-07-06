import { Roles, UserList } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { Service } from "../Service";
import { RoleUpdater, RoleUpdaterImpl } from "./RoleUpdater";
import {
  StreamPermissionRequester,
  StreamPermissionRequesterImpl,
} from "./StreamPermissionRequester";
import { UserDataLoader, UserDataLoaderImpl } from "./UserDataLoader";
import { UserFollower, UserFollowerImpl } from "./UserFollower";
import { UserListFetcher, UserListFetcherImpl } from "./UserListFetcher";
import { UserSearcher, UserSearcherImpl } from "./UserSearcher";

export class UserService
  extends Service
  implements
    UserDataLoader,
    UserSearcher,
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
  private searcher: UserSearcher;

  constructor(state: IStore | AppState) {
    super(state);

    this.loader = new UserDataLoaderImpl(this.state);
    this.roleUpdater = new RoleUpdaterImpl(this.state);
    this.streamPermissionRequester = new StreamPermissionRequesterImpl(
      this.state
    );
    this.follower = new UserFollowerImpl(this.state);
    this.listFetcher = new UserListFetcherImpl(this.state);
    this.searcher = new UserSearcherImpl(this.state);
  }

  resetUserSearch() {
    return this.searcher.resetUserSearch();
  }

  searchUsers(query: string) {
    return this.searcher.searchUsers(query);
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
