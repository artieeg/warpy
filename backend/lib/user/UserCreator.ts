import { INewUser, INewUserResponse } from '@warpy/lib';

export interface UserCreator {
  createNewUser: (data: INewUser) => Promise<INewUserResponse>;
}
