import {IUserDeleteResponse} from '@warpy/lib';
import {WebSocketConn} from './connection';

export interface IUserAPI {
  create: (data: INewUser) => any;
  auth: (token: string) => any;
  delete: () => Promise<IUserDeleteResponse>;
}

export interface INewUser {
  username: string;
  last_name: string;
  first_name: string;
  email: string;
  kind: 'dev' | 'apple' | 'google' | 'twitter' | 'facebook';
}

export const UserAPI = (socket: WebSocketConn): IUserAPI => ({
  create: (data: INewUser) => socket.request('new-user', data),
  auth: token => socket.request('auth', {token}),
  delete: () => socket.request('delete-user', {}),
});
