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

    const { user, following, hasActivatedAppInvite, categories } =
      await api.user.auth(token);

    if (!user) {
      set({
        isLoadingUser: false,
        exists: false,
      });
    } else {
      set({
        user,
        categories,
        exists: true,
        hasActivatedAppInvite,
        following: following || [],
        isLoadingUser: false,
        //selectedFeedCategory: categories[0],
        newStreamCategory: categories[1],
      });
    }
  },

  async dispatchUserRoleUpdate(role, mediaPermissionToken, sendMediaParams) {
    set(
      produce<IStore>((store) => {
        const oldRole = get().role;

        store.role = role;
        store.isRaisingHand = false;

        if (sendMediaParams) {
          store.sendMediaParams = sendMediaParams;
        }

        get().dispatchToastMessage(`You are a ${role} now`);

        if (role === "viewer") {
          get().dispatchProducerClose(["audio", "video"]);
        } else if (role === "speaker") {
          get().dispatchProducerClose(["video"]);
        }

        if (oldRole === "streamer" && role === "speaker") {
          store.videoEnabled = false;
        } else if (role !== "viewer") {
          const kind = role === "speaker" ? "audio" : "video";

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
