import {IUser} from '@app/models';
import {getAppUserData} from '@app/services';
import {AppThunk} from '@app/store';

export const SET_APP_USER = 'SET_APP_USER';

export const setAppUser = (user: IUser) => {
  return {
    type: SET_APP_USER,
    payload: {
      user,
    },
  };
};

export const getCurrentUser = (): AppThunk<void> => {
  return async dispatch => {
    const user = await getAppUserData();
    return dispatch(setAppUser(user));
  };
};
