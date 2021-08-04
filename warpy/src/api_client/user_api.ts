import {WebSocketConn} from './connection';

export const UserAPI = (socket: WebSocketConn) => ({
  create: () => {},
  auth: (token: string) => socket.request('auth', {token}),
});
