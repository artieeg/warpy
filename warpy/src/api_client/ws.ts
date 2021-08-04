import {WebSocketConn} from './connection';
import {FeedAPI} from './feed_api';
import {StreamAPI} from './stream_api';
import {MediaAPI} from './media_api';
import {UserAPI} from './user_api';
import {APIObserver} from './api_observer';

export const APIClient = (socket: WebSocketConn) => ({
  observer: APIObserver(socket),
  removeAllListeners: () =>
    socket.observer
      .eventNames()
      .forEach(event => socket.observer.removeAllListeners(event)),
  user: UserAPI(socket),
  stream: StreamAPI(socket),
  feed: FeedAPI(socket),
  media: MediaAPI(socket),
});
