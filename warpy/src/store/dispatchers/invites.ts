import produce from 'immer';
import {StoreSlice} from '../types';
import {IStore} from '../useStore';

export interface IInviteDispatchers {
  dispatchPendingInvite: (user: string) => void;
  dispatchCancelInvite: (user: string) => Promise<void>;
  dispatchSendPendingInvites: () => Promise<void>;
}

export const createInviteDispatchers: StoreSlice<IInviteDispatchers> = (
  set,
  get,
) => ({
  async dispatchSendPendingInvites() {
    const {pendingInviteUserIds, api, stream} = get();

    const promises = pendingInviteUserIds.map(userToInvite =>
      api.stream.invite(userToInvite, stream),
    );

    await Promise.all(promises);

    set({
      pendingInviteUserIds: [],
    });
  },

  dispatchPendingInvite(user) {
    set(
      produce<IStore>(state => {
        state.pendingInviteUserIds.push(user);
      }),
    );
  },

  async dispatchCancelInvite(user) {
    const {api, sentInvites} = get();

    const sentInviteId = sentInvites[user]?.id;

    if (sentInviteId) {
      await api.stream.cancelInvite(sentInviteId);
    }

    set(
      produce<IStore>(state => {
        state.pendingInviteUserIds = state.pendingInviteUserIds.filter(
          id => id !== user,
        );

        delete state.sentInvites[user];
      }),
    );
  },
});
