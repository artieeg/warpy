import {IChatMessage} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface IChatSlice {
  messages: IChatMessage[];
}

export const createChatSlice: StoreSlice<IChatSlice> = () => ({
  messages: [],
});
