import {IUser, Roles} from '@warpy/lib';
import {StoreSlice} from '../types';

export interface IUserSlice {
  user: IUser | null;
  role: Roles | null;
  isLoadingUser: boolean;
  exists: boolean;
  following: string[];
  isRaisingHand: boolean;
  hasActivatedAppInvite: boolean;
}

export const createUserSlice: StoreSlice<IUserSlice> = () => ({
  isRaisingHand: false,
  user: null,
  role: null,
  isLoadingUser: true,
  exists: false,
  following: [],
  hasActivatedAppInvite: false,
});
