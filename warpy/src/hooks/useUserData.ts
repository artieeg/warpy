import {useAsyncMemo} from 'use-async-memo';
import {useStore} from '@app/store';

export const useUserData = (id?: string) =>
  useAsyncMemo(
    async () => (id ? useStore.getState().api.user.get(id) : undefined),
    [id],
  );
