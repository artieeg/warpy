import {WebSocketConn} from './connection';

export interface IUserAPI {
  create: () => any;
  auth: (token: string) => any;
}

export const UserAPI = (socket: WebSocketConn): IUserAPI => ({
  create: () => {},
  auth: token => socket.request('auth', {token}),
});
