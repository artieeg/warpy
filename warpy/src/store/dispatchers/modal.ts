import {Modal} from '@app/types';
import {IBot} from '@warpy/lib';
import {StoreSlice} from '../types';

type OpenModalParams = {
  selectedUser?: string;
  botConfirmId?: string;
  botConfirmData?: IBot;
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
      modalBotConfirmData: params?.botConfirmData || null,
      modalBotConfirmId: params?.botConfirmId || null,
    });
  },
});
