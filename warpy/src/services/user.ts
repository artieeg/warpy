import {User} from '@app/models';
import {get, post} from './api';

export const getAppUserData = async () => {
  try {
    const response = await get('whoami', {auth: true});
    const {user} = response.data;

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
  try {
    const response = await post('user/dev', {
      auth: false,
      body: {
        username: params.username,
        email: params.email,
        last_name: params.lastName,
        first_name: params.firstName,
      },
    });

    const {access, refresh} = response.data;
    return {access, refresh};
  } catch (e) {
    console.log(e.request);
    throw e;
  }
};
