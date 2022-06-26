import { UserList } from "@warpy/lib";
import { StoreDispatcherSlice } from "../types";

export type FetchNextFn = () => Promise<void>;

export interface IUserListDispatchers {
  dispatchFetchUserList: (list: UserList) => Promise<FetchNextFn>;
}

export const createUserListDispatchers: StoreDispatcherSlice<IUserListDispatchers> =
  (runner, { user }) => ({
    async dispatchFetchUserList(list) {
      ///TODO: don't return "fn"

      const fn = async () => {
        await runner.mergeStateUpdate(user.fetchUserList(list));
      };

      await fn();

      return fn;
    },
  });
