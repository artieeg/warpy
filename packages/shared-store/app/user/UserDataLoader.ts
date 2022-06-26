import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StreamedStateUpdate } from "../types";

export interface UserDataLoader {
  loadUserData: (access_token: string) => StreamedStateUpdate;
}

export class UserDataLoaderImpl implements UserDataLoader {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async *loadUserData(access_token: string) {
    const { api } = this.state.get();

    yield this.state.update({
      isLoadingUser: true,
    });

    const { user, friendFeed, following, hasActivatedAppInvite, categories } =
      await api.user.auth(access_token);

    if (!user) {
      yield this.state.update({
        isLoadingUser: false,
        exists: false,
      });
    } else {
      console.log({ newStreamCategory: categories[1] });

      yield this.state.update({
        friendFeed,
        user,
        categories,
        exists: true,
        hasActivatedAppInvite,
        list_following: {
          list: following,
          page: 0,
        },
        isLoadingUser: false,
        //selectedFeedCategory: categories[0],
        newStreamCategory: categories[1],
      });
    }
  }
}
