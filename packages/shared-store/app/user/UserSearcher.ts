import { IUser } from "@warpy/lib";
import { AppState } from "../AppState";
import { IStore } from "../../useStore";
import { StateUpdate, StreamedStateUpdate } from "../types";

export interface UserSearcher {
  searchUsers: (query: string) => StreamedStateUpdate;
  resetUserSearch: () => StateUpdate;
}

export class UserSearcherImpl implements UserSearcher {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async *searchUsers(query: string) {
    const { api } = this.state.get();

    yield this.state.update({
      isSearchingUsers: true,
    });

    const { users } = await api.user.search(query);

    yield this.state.update((state) => {
      state.userSearchResult = [...state.userSearchResult, ...users];
      state.isSearchingUsers = false;
    });
  }

  resetUserSearch() {
    return this.state.update({
      isSearchingUsers: false,
      userSearchResult: [],
    });
  }
}
