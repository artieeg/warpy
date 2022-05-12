import { Roles } from "@warpy/lib";
import produce from "immer";
import { StoreSlice } from "../types";
import { IStore } from "../useStore";

export interface IUserDispatchers {
  dispatchUserRoleUpdate: (
    role: Roles,
    mediaPermissionToken: string,
    sendMediaParams?: any
  ) => Promise<void>;
  dispatchUserLoadData: (token: string) => Promise<void>;
  dispatchUserHandRaiseToggle: () => void;
}

export const createUserDispatchers: StoreSlice<IUserDispatchers> = (
  set,
  get
) => ({
  async dispatchUserLoadData(token) {
    const { api } = get();

    set({
      isLoadingUser: true,
    });

    const { user, friendFeed, following, hasActivatedAppInvite, categories } =
      await api.user.auth(token);

    if (!user) {
      set({
        isLoadingUser: false,
        exists: false,
      });
    } else {
      set({
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
  },

  async dispatchUserRoleUpdate(newRole, mediaPermissionToken, sendMediaParams) {
    set(
      produce<IStore>((store) => {
        const oldRole = get().role;

        store.role = newRole;
        store.isRaisingHand = false;

        if (sendMediaParams) {
          store.sendMediaParams = sendMediaParams;
        }

        get().dispatchToastMessage(`You are a ${newRole} now`);

        if (newRole === "viewer") {
          get().dispatchProducerClose(["audio", "video"]);
        } else if (newRole === "speaker") {
          get().dispatchProducerClose(["video"]);
        }

        if (oldRole === "streamer" && newRole === "speaker") {
          store.videoEnabled = false;
        } else if (newRole !== "viewer") {
          const kind = newRole === "speaker" ? "audio" : "video";

          get().dispatchMediaSend(mediaPermissionToken, [kind]);
        } else {
          store.videoEnabled = false;
          store.audioEnabled = false;
        }
      })
    );
  },

  async dispatchUserHandRaiseToggle() {
    const { api, isRaisingHand } = get();

    if (isRaisingHand) {
      api.stream.lowerHand();
    } else {
      api.stream.raiseHand();
    }

    set({
      isRaisingHand: !isRaisingHand,
    });
  },
});
