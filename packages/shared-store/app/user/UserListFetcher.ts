import { UserList } from "@warpy/lib";
import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StateUpdate } from "../types";

export interface UserListFetcher {
  fetchUserList: (list: UserList) => Promise<StateUpdate>;
}

export class UserListFetcherImpl implements UserListFetcher {
  private state: AppState;

  constructor(state: AppState | IStore) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async fetchUserList(list: UserList) {
    const key: string = ("list_" + list) as any;

    const { api, [key]: listData } = this.state.get() as any;
    const { users } = await api.user.fetchUserList(list, listData.page);

    return this.state.update({
      [key]: {
        page: listData.page + 1,
        list: [...listData.list, ...users],
      },
    });
  }
}
