import {WebSocketConn} from './connection';

export const UserAPI = (socket: WebSocketConn) => ({
  create: () => {},
  whoAmI: (token: string) => socket.request('whoami', {token}),
});
