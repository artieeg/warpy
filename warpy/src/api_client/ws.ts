import {WebSocketConn} from './connection';
import {StreamAPI} from './stream_api';
import {UserAPI} from './user_api';

export const APIClient = (socket: WebSocketConn) => ({
  socket,
  user: UserAPI(socket),
  stream: StreamAPI(socket),
  feed: FeedAPI(socket),
});
