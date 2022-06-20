import { Roles } from "@warpy/lib";
import produce from "immer";
import { UserService } from "../app/user";
import { StoreSlice } from "../types";
import { IStore, runner } from "../useStore";

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
    await runner.mergeStreamedUpdates(
      new UserService(get()).loadUserData(token)
    );
  },

  async dispatchUserRoleUpdate(newRole, mediaPermissionToken, sendMediaParams) {
    const oldRole = get().role;

    set(
      produce<IStore>((store) => {
        store.role = newRole;
        store.isRaisingHand = false;

        if (sendMediaParams) {
          store.sendMediaParams = sendMediaParams;
        }
      })
    );

    set(
      produce<IStore>((store) => {
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
