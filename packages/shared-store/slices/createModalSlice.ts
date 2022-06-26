import { IBaseUser, IBot, IInvite } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IModalSlice {
  modalCurrent: Modal | null;
  modalSelectedUser: IBaseUser | null;
  modalInvite: IInvite | null;
  modalBotConfirmData: IBot | null;
  modalCloseAfterHostReassign: boolean;
  modalBotConfirmId: string | null;
  modalUserToAward: IBaseUser | null;
}

export const createModalSlice: StoreSlice<IModalSlice> = () => ({
  modalCurrent: null,
  modalSelectedUser: null,
  modalInvite: null,
  modalBotConfirmData: null,
  modalBotConfirmId: null,
  modalUserToAward: null,
  modalCloseAfterHostReassign: false,
});
