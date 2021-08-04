import {WebSocketConn} from './connection';
import {FeedAPI} from './feed_api';
import {IStreamAPI, StreamAPI} from './stream_api';
import {MediaAPI} from './media_api';
import {UserAPI} from './user_api';
import {APIObserver} from './api_observer';

interface IAPIClient {
  observer: ReturnType<typeof APIObserver>;
  user: ReturnType<typeof UserAPI>;
  stream: IStreamAPI;
  feed: ReturnType<typeof FeedAPI>;
  media: ReturnType<typeof MediaAPI>;
}

export const APIClient = (socket: WebSocketConn): IAPIClient => ({
  observer: APIObserver(socket),
  user: UserAPI(socket),
  stream: StreamAPI(socket),
  feed: FeedAPI(socket),
  media: MediaAPI(socket),
});

export type APIClient = ReturnType<typeof APIClient>;
