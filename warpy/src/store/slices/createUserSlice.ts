import {User} from '@app/models';
import {Roles} from '@warpy/lib';
import {GetState, SetState} from 'zustand';
import {IStore} from '../useStore';

export interface IUserSlice {
  user: User | null;
  role: Roles | null;
  isLoadingUser: boolean;
  exists: boolean;
  following: string[];
}

export const createUserSlice = (
  set: SetState<IStore>,
  get: GetState<IStore>,
): IUserSlice => ({
  user: null,
  role: null,
  isLoadingUser: true,
  exists: false,
  following: [],
});
