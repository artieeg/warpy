import {navigation} from '@app/navigation';
import produce from 'immer';
import {StoreSlice} from '../types';
import {IStore} from '../useStore';

export interface IInviteDispatchers {
  dispatchPendingInvite: (user: string) => void;
  dispatchCancelInvite: (user: string) => Promise<void>;
  dispatchSendPendingInvites: () => Promise<void>;
  dispatchInviteAction: (action: 'accept' | 'decline') => Promise<void>;
}

export const createInviteDispatchers: StoreSlice<IInviteDispatchers> = (
  set,
  get,
) => ({
  async dispatchInviteAction(action) {
    const {api, modalInvite} = get();

    if (!modalInvite) return;

    api.stream.sendInviteAction(modalInvite.id, action);

    //If the stream had begun already
    //else the api.strea.onStreamIdAvailable
    //will fire after the host starts the room
    if (modalInvite.stream?.id) {
      navigation.current?.navigate('Stream', {
        stream: modalInvite.stream,
      });
    }

    get().dispatchModalClose();
  },

  async dispatchSendPendingInvites() {
    const {pendingInviteUserIds, api, stream} = get();

    console.log(pendingInviteUserIds);

    const promises = pendingInviteUserIds.map(userToInvite =>
      api.stream.invite(userToInvite, stream),
    );
    console.log(promises.length);

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
