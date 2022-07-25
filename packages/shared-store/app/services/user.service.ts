import { FriendFeedItem, Roles, User, UserBase } from "@warpy/lib";
import { AppState } from "../AppState";
import { MediaService } from "./media.service";
import { Service } from "../Service";
import { ToastService } from "./toast.service";
import { Store } from "@app/store";

type UserList = {
  page: number;
  list: User[];
};

export interface UserData {
  user: UserBase | null;
  role: Roles | null;
  isLoadingUser: boolean;
  exists: boolean;
  following: string[];
  isRaisingHand: boolean;
  hasActivatedAppInvite: boolean;
  userSearchResult: User[];
  isSearchingUsers: boolean;
  list_blocked: UserList;
  list_following: UserList;
  list_followers: UserList;
  signUpName: string;
  signUpUsername: string;
  signUpAvatar: string;
  friendFeed: FriendFeedItem[];
}

export class UserService extends Service<UserData> {
  private toast: ToastService;
  private media: MediaService;

  constructor(state: Store | AppState) {
    super(state);

    this.toast = new ToastService(this.state);
    this.media = new MediaService(this.state);
  }

  getInitialState() {
    return {
      isRaisingHand: false,
      user: null,
      role: null,
      isLoadingUser: true,
      exists: false,
      friendFeed: [],
      following: [],
      signUpName: "",
      signUpUsername: "",
      signUpAvatar: "",
      hasActivatedAppInvite: false,
      userSearchResult: [],
      isSearchingUsers: false,
      list_blocked: {
        page: 0,
        list: [],
      },
      list_followers: {
        page: 0,
        list: [],
      },
      list_following: {
        page: 0,
        list: [],
      },
    };
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

  requestStreamPermission() {
    const { api, isRaisingHand } = this.state.get();

    if (isRaisingHand) {
      api.stream.lowerHand();
    } else {
      api.stream.raiseHand();
    }

    return this.state.update({
      isRaisingHand: !isRaisingHand,
    });
  }

  async updateUserRole({
    role,
    mediaPermissionToken,
    sendMediaParams,
  }: {
    role: Roles;
    mediaPermissionToken: string;
    sendMediaParams: any;
  }) {
    const { role: oldRole } = this.state.get();

    this.state.update({
      role,
      isRaisingHand: false,
      sendMediaParams,
    });

    this.toast.showToastMessage(`You are a ${role} now`);

    if (role === "viewer") {
      this.media.closeProducer("audio", "video");
    } else if (role === "speaker") {
      this.media.closeProducer("video");
    }

    if (oldRole === "streamer" && role === "speaker") {
      this.state.update({ videoEnabled: false });
    } else if (role !== "viewer") {
      const kind = role === "speaker" ? "audio" : "video";
      await this.media.stream({
        token: mediaPermissionToken,
        streamMediaImmediately: false,
        sendMediaParams,
        kind,
      });
    } else {
      this.state.update({
        videoEnabled: false,
        audioEnabled: false,
      });
    }

    return this.state.update({
      role,
      isRaisingHand: false,
      sendMediaParams,
    });
  }
}
