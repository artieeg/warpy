import {UserList} from '@warpy/lib';
import produce from 'immer';
import {IUserListSlice} from '../slices/createUserListSlice';
import {StoreSlice} from '../types';
import {IStore} from '../useStore';

export type FetchNextFn = () => Promise<void>;

export interface IUserListDispatchers {
  dispatchFetchUserList: (list: UserList) => Promise<FetchNextFn>;
}

export const createUserListDispatchers: StoreSlice<IUserListDispatchers> = (
  set,
  get,
) => ({
  async dispatchFetchUserList(list) {
    const {api} = get();

    const fn = async () => {
      const key: keyof IUserListSlice = ('list_' + list) as any;
      const {users} = await api.user.fetchUserList(list, get()[key].page);

      set(
        produce<IStore>(state => {
          state[key].page++;
          state[key].list = [...state[key].list, ...users];
        }),
      );
    };

    await fn();

    return fn;
  },
});
