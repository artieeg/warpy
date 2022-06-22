import { IStore } from "../../useStore";
import { AppState } from "../AppState";
import { StateUpdate } from "../types";

export interface UserFollower {
  follow: (newFollowedUser: string) => Promise<StateUpdate>;
  unfollow: (userToUnfollow: string) => Promise<StateUpdate>;
}

export class UserFollowerImpl implements UserFollower {
  private state: AppState;

  constructor(state: IStore | AppState) {
    if (state instanceof AppState) {
      this.state = state;
    } else {
      this.state = new AppState(state);
    }
  }

  async follow(newFollowedUser: string) {
    const { api } = this.state.get();

    const { followedUser } = await api.user.follow(newFollowedUser);

    return this.state.update({
      following: [...this.state.get().following, followedUser],
    });
  }

  async unfollow(userToUnfollow: string) {
    const { api } = this.state.get();
    await api.user.unfollow(userToUnfollow);

    return this.state.update({
      following: this.state
        .get()
        .following.filter((id) => id !== userToUnfollow),
    });
  }
}
