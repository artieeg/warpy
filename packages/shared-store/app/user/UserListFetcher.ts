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
    const { api } = this.state.get();

    const key: string = ("list_" + list) as any;
    const { users } = await api.user.fetchUserList(
      list,
      this.state.get()[key].page
    );

    return this.state.update({
      [key]: {
        page: this.state.get()[key].page + 1,
        list: [...this.state.get()[key].list, ...users],
      },
    });
  }
}
