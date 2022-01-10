import { Modal } from "@app/types";
import { IBaseUser, IBot, IInvite } from "@warpy/lib";
import { StoreSlice } from "../types";

type OpenModalParams = {
  selectedUser?: IBaseUser;
  userToAward?: IBaseUser;
  botConfirmId?: string;
  botConfirmData?: IBot;
  invite?: IInvite & { notification: string };
};

export interface IModalDispatchers {
  dispatchModalOpen: (modal: Modal, params?: OpenModalParams) => void;
  dispatchModalClose: () => void;
}

export const createModalDispatchers: StoreSlice<IModalDispatchers> = (
  set,
  get
) => ({
  dispatchModalClose() {
    set({
      modalCurrent: null,
      modalSelectedUser: null,
      modalBotConfirmId: null,
      modalBotConfirmData: null,
      modalInvite: null,
    });
  },
  dispatchModalOpen(modal, params) {
    set({
      modalCurrent: modal === get().modalCurrent ? null : modal,
      modalSelectedUser: params?.selectedUser || null,
      modalBotConfirmData: params?.botConfirmData || null,
      modalBotConfirmId: params?.botConfirmId || null,
      modalUserToAward: params?.userToAward || null,
      modalInvite: params?.invite || null,
    });
  },
});
