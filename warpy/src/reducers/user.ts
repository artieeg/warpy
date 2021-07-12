import {SET_APP_USER} from '@app/actions';
import {IUser} from '@app/models';
import {Reducer} from 'redux';

export interface IAppUserReducer {
  data?: IUser;
  error?: Error;
}

export const user: Reducer<IAppUserReducer> = (
  state: IAppUserReducer | undefined,
  action: any,
) => {
  const {type, payload} = action;

  switch (type) {
    case SET_APP_USER: {
      return {
        ...state,
        data: payload.user,
      };
    }
    default: {
      return {};
    }
  }
};
