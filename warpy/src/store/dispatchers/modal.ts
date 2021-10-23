import {Modal} from '@app/types';
import {StoreSlice} from '../types';

type OpenModalParams = {
  selectedUser?: string;
};

export interface IModalDispatchers {
  dispatchModalOpen: (modal: Modal, params?: OpenModalParams) => void;
  dispatchModalClose: () => void;
}

export const createModalDispatchers: StoreSlice<IModalDispatchers> = (
  set,
  get,
) => ({
  dispatchModalClose() {
    set({
      modalCurrent: null,
      modalSelectedUser: null,
    });
  },
  dispatchModalOpen(modal, params) {
    set({
      modalCurrent: modal === get().modalCurrent ? null : modal,
      modalSelectedUser: params?.selectedUser || null,
    });
  },
});
