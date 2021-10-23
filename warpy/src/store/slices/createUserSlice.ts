import {User} from '@app/models';
import {Roles} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface IUserSlice {
  user: User | null;
  role: Roles | null;
  isLoadingUser: boolean;
  exists: boolean;
  following: string[];
}

export const createUserSlice: StoreSlice<IUserSlice> = () => ({
  user: null,
  role: null,
  isLoadingUser: true,
  exists: false,
  following: [],
});
