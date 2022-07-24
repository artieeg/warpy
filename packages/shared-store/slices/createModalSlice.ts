import { UserBase, Bot, IInvite } from "@warpy/lib";
import { StoreSlice } from "../types";

export interface IModalSlice {
  modalCurrent: Modal | null;
  modalSelectedUser: UserBase | null;
  modalInvite: IInvite | null;
  modalBotConfirmData: Bot | null;
  modalCloseAfterHostReassign: boolean;
  modalBotConfirmId: string | null;
  modalUserToAward: UserBase | null;
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
