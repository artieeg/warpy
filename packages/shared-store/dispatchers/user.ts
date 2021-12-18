import { Roles } from "@warpy/lib";
import { StoreSlice } from "../types";

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

    console.log({ hasActivatedAppInvite });

    if (!user) {
      set({
        isLoadingUser: false,
        exists: false,
      });

      return;
    }

    set({
      user,
      categories,
      selectedCategoryIds: [categories[0].id],
      exists: true,
      hasActivatedAppInvite,
      following: following || [],
      isLoadingUser: false,
    });
  },

  async dispatchUserRoleUpdate(role, mediaPermissionToken, sendMediaParams) {
    const oldRole = get().role;

    if (sendMediaParams) {
      set({ sendMediaParams, role, isRaisingHand: false });
    } else {
      set({ role, isRaisingHand: false });
    }

    get().dispatchToastMessage(`You are a ${role} now`);

    if (role === "viewer") {
      get().dispatchProducerClose(["audio", "video"]);
    } else if (role === "speaker") {
      get().dispatchProducerClose(["video"]);
    }

    if (oldRole === "streamer" && role === "speaker") {
      set({
        videoEnabled: false,
      });
    } else if (role !== "viewer") {
      const kind = role === "speaker" ? "audio" : "video";
      await get().dispatchMediaSend(mediaPermissionToken, [kind]);
    } else {
      set({
        videoEnabled: false,
        audioEnabled: false,
      });
    }
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
