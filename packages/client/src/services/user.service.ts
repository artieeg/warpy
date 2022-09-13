import {
  FriendFeedItem,
  Participant,
  Roles,
  Stream,
  User,
  UserBase,
} from "@warpy/lib";
import { MediaService } from "./media.service";
import { Service } from "../Service";
import { ToastService } from "./toast.service";
import { StateSetter, StateGetter } from "../types";

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

  constructor(set: StateSetter, get: StateGetter) {
    super(set, get);
    this.toast = new ToastService(set, get);
    this.media = new MediaService(set, get);
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

  async setAvatar(url: string) {
    await this.get().api.user.update("avatar", url);

    return this.set((state) => {
      if (!state.user) {
        return;
      }

      state.user = {
        ...state.user,
        avatar: url,
      };
    });
  }

  async *searchUsers(query: string) {
    const { api } = this.get();

    yield this.set({
      isSearchingUsers: true,
    });

    const { users } = await api.user.search(query);

    yield this.set((state) => {
      state.userSearchResult = [...state.userSearchResult, ...users];
      state.isSearchingUsers = false;
    });
  }

  resetUserSearch() {
    return this.set({
      isSearchingUsers: false,
      userSearchResult: [],
    });
  }

  async fetchUserList(list: UserList) {
    const key: string = ("list_" + list) as any;

    const { api, [key]: listData } = this.get() as any;
    const { users } = await api.user.fetchUserList(list, listData.page);

    return this.set({
      [key]: {
        page: listData.page + 1,
        //list: [...listData.list, ...users],
        list: [...users],
      },
    });
  }

  async follow(newFollowedUser: string) {
    const { api } = this.get();

    const { followedUser } = await api.user.follow(newFollowedUser);

    return this.set({
      following: [...this.get().following, followedUser],
    });
  }

  async unfollow(userToUnfollow: string) {
    const { api } = this.get();
    await api.user.unfollow(userToUnfollow);

    return this.set({
      following: this.get().following.filter((id) => id !== userToUnfollow),
    });
  }

  addFriendFeedUser(p: Participant, stream: Stream) {
    return this.set((state) => {
      state.friendFeed = [
        ...state.friendFeed,
        { user: { ...p, online: true }, stream: stream },
      ];
    });
  }

  delFriendFeedUser(user: string) {
    return this.set((state) => {
      state.friendFeed = state.friendFeed.filter((i) => i.user.id !== user);
    });
  }

  async loadUserData(access_token: string) {
    const { api } = this.get();

    const { user, friendFeed, following, hasActivatedAppInvite, categories } =
      await api.user.auth(access_token);

    if (!user) {
      return this.set({
        exists: false,
      });
    } else {
      return this.set({
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
        newStreamCategory: categories[1],
        selectedFeedCategory: categories.find((c) => c.id === "foru"),
      });
    }
  }

  requestStreamPermission() {
    const { api, isRaisingHand } = this.get();

    if (isRaisingHand) {
      api.stream.lowerHand();
    } else {
      api.stream.raiseHand();
    }

    return this.set({
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
    const { role: oldRole } = this.get();

    this.set({
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
      this.set({ videoEnabled: false });
    } else if (role !== "viewer") {
      const kind = role === "speaker" ? "audio" : "video";
      await this.media.stream({
        token: mediaPermissionToken,
        streamMediaImmediately: false,
        sendMediaParams,
        kind,
      });
    } else {
      this.set({
        videoEnabled: false,
        audioEnabled: false,
      });
    }

    return this.set({
      role,
      isRaisingHand: false,
      sendMediaParams,
    });
  }
}
