import {StoreSlice} from '../types';

export interface IStreamSlice {
  stream: string | null;
  title: string | null;
  isStreamOwner: boolean;
}

export const createStreamSlice: StoreSlice<IStreamSlice> = () => ({
  stream: null,
  isStreamOwner: false,
  title: 'test title',
});
