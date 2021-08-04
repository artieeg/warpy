import {WebSocketConn} from './connection';
import {FeedAPI} from './feed_api';
import {StreamAPI} from './stream_api';
import {MediaAPI} from './media_api';
import {UserAPI} from './user_api';

export const APIClient = (socket: WebSocketConn) => ({
  socket,
  user: UserAPI(socket),
  stream: StreamAPI(socket),
  feed: FeedAPI(socket),
  media: MediaAPi(socket),
});
