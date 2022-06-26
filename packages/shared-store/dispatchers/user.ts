import { Roles } from "@warpy/lib";
import { StoreDispatcherSlice } from "../types";

export interface IUserDispatchers {
  dispatchUserRoleUpdate: (
    role: Roles,
    mediaPermissionToken: string,
    sendMediaParams?: any
  ) => Promise<void>;
  dispatchUserLoadData: (token: string) => Promise<void>;
  dispatchUserHandRaiseToggle: () => void;
}

export const createUserDispatchers: StoreDispatcherSlice<IUserDispatchers> = (
  runner,
  { user }
) => ({
  async dispatchUserLoadData(token) {
    await runner.mergeStreamedUpdates(user.loadUserData(token));
  },

  async dispatchUserRoleUpdate(newRole, mediaPermissionToken, sendMediaParams) {
    await runner.mergeStreamedUpdates(
      user.updateUserRole({
        role: newRole,
        mediaPermissionToken,
        sendMediaParams,
      })
    );
  },

  async dispatchUserHandRaiseToggle() {
    await runner.mergeStateUpdate(user.requestStreamPermission());
  },
});
