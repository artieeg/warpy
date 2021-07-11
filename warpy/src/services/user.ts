import {User} from '@app/models';
import {get} from './api';

export const getAppUserData = async () => {
  try {
    const response = await get('whoami', {auth: true});
    const {user} = JSON.parse(response.data);

    return User.fromJSON(user);
  } catch (e) {
    throw e; //TODO;
  }
};

export interface ISignUpParams {
  username: string;
  email: string;
  lastName: string;
  firstName: string;
}

export const signUpWithDev = async (params: ISignUpParams) => {
  //TODO
};
