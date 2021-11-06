import {Modal} from '@app/types';
import {IBot} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface IModalSlice {
  modalCurrent: Modal | null;
  modalSelectedUser: string | null;
  modalBotConfirmData: IBot | null;
  modalBotConfirmId: string | null;
}

export const createModalSlice: StoreSlice<IModalSlice> = () => ({
  modalCurrent: null,
  modalSelectedUser: null,
  modalBotConfirmData: null,
  modalBotConfirmId: null,
});
