import { Roles } from "@warpy/lib";
import { UserService } from "../app/user";
import { StoreSlice } from "../types";
import { runner } from "../useStore";

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
  _set,
  get
) => ({
  async dispatchUserLoadData(token) {
    await runner.mergeStreamedUpdates(
      new UserService(get()).loadUserData(token)
    );
  },

  async dispatchUserRoleUpdate(newRole, mediaPermissionToken, sendMediaParams) {
    await runner.mergeStreamedUpdates(
      new UserService(get()).updateUserRole({
        role: newRole,
        mediaPermissionToken,
        sendMediaParams,
      })
    );
  },

  async dispatchUserHandRaiseToggle() {
    await runner.mergeStateUpdate(
      new UserService(get()).requestStreamPermission()
    );
  },
});
