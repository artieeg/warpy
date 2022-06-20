import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { UserDataLoader, UserDataLoaderImpl } from "./UserDataLoader";

export class UserService implements UserDataLoader {
  private loader: UserDataLoader;

  constructor(state: IStore | AppState) {
    this.loader = new UserDataLoaderImpl(state);
  }

  loadUserData(access_token: string) {
    return this.loader.loadUserData(access_token);
  }
}
