import {Modal} from '@app/types';
import {IBot, IInvite} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface IModalSlice {
  modalCurrent: Modal | null;
  modalSelectedUser: string | null;
  modalInvite: (IInvite & {notification: string}) | null;
  modalBotConfirmData: IBot | null;
  modalBotConfirmId: string | null;
  modalUserToAward: string | null;
}

export const createModalSlice: StoreSlice<IModalSlice> = () => ({
  modalCurrent: null,
  modalSelectedUser: null,
  modalInvite: null,
  modalBotConfirmData: null,
  modalBotConfirmId: null,
  modalUserToAward: null,
});
