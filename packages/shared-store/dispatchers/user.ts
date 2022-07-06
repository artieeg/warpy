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

  dispatchUserSearch: (query: string) => Promise<void>;
  dispatchUserSearchReset: () => void;
}

export const createUserDispatchers: StoreDispatcherSlice<IUserDispatchers> = (
  runner,
  { user }
) => ({
  async dispatchUserLoadData(token) {
    await runner.mergeStreamedUpdates(user.loadUserData(token));
  },

  async dispatchUserSearch(query: string) {
    await runner.mergeStreamedUpdates(user.searchUsers(query));
  },

  dispatchUserSearchReset() {
    runner.mergeStateUpdate(user.resetUserSearch());
  },

  async dispatchUserRoleUpdate(newRole, mediaPermissionToken, sendMediaParams) {
    await runner.mergeStateUpdate(
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
