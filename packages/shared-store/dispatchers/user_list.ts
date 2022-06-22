import { UserList } from "@warpy/lib";
import { UserService } from "../app/user";
import { StoreSlice } from "../types";
import { runner } from "../useStore";

export type FetchNextFn = () => Promise<void>;

export interface IUserListDispatchers {
  dispatchFetchUserList: (list: UserList) => Promise<FetchNextFn>;
}

export const createUserListDispatchers: StoreSlice<IUserListDispatchers> = (
  _set,
  get
) => ({
  async dispatchFetchUserList(list) {
    ///TODO: don't return "fn"

    const fn = async () => {
      await runner.mergeStateUpdate(new UserService(get()).fetchUserList(list));
    };

    await fn();

    return fn;
  },
});
