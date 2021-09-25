import {StoreSlice} from '../types';

type Modal =
  | 'user-actions'
  | 'participant-info'
  | 'participants'
  | 'reactions'
  | 'reports'
  | 'chat';

type OpenModalParams = {
  selectedUser?: string;
};

export interface IModalSlice {
  modalCurrent: Modal | null;
  modalSelectedUser: string | null;

  openNewModal: (modal: Modal, params?: OpenModalParams) => void;
  closeCurrentModal: () => void;
}

export const createModalSlice: StoreSlice<IModalSlice> = (set, get) => ({
  modalCurrent: null,
  modalSelectedUser: null,
  closeCurrentModal() {
    set({
      modalCurrent: null,
      modalSelectedUser: null,
    });
  },
  openNewModal(modal, params) {
    set({
      modalCurrent: modal === get().modalCurrent ? null : modal,
      modalSelectedUser: params?.selectedUser || null,
    });
  },
});
