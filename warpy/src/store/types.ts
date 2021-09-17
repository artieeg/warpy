import {GetState, SetState} from 'zustand';
import {IStore} from './useStore';

export type StoreSlice<T> = (set: SetState<IStore>, get: GetState<IStore>) => T;
