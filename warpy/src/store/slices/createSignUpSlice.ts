import {StoreSlice} from '../types';

export interface ISignUpSlice {
  signUpName: string;
  signUpUsername: string;
  signUpAvatar: string;
}

export const createSignUpSlice: StoreSlice<ISignUpSlice> = () => ({
  signUpName: '',
  signUpUsername: '',
  signUpAvatar: '',
});
