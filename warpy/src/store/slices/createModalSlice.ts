import {Modal} from '@app/types';
import {StoreSlice} from '../types';

export interface IModalSlice {
  modalCurrent: Modal | null;
  modalSelectedUser: string | null;
}

export const createModalSlice: StoreSlice<IModalSlice> = () => ({
  modalCurrent: null,
  modalSelectedUser: null,
});
