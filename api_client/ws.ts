import { WebSocketConn } from "./connection";
import { FeedAPI, IFeedAPI } from "./feed_api";
import { IStreamAPI, StreamAPI } from "./stream_api";
import { IMediaAPI, MediaAPI } from "./media_api";
import { IUserAPI, UserAPI } from "./user_api";
import { APIObserver, IAPIObserver } from "./api_observer";

interface IAPIClient {
  observer: IAPIObserver;
  user: IUserAPI;
  stream: IStreamAPI;
  feed: IFeedAPI;
  media: IMediaAPI;
  close: () => void;
}

export const APIClient = (socket: WebSocketConn): IAPIClient => ({
  observer: APIObserver(socket),
  user: UserAPI(socket),
  stream: StreamAPI(socket),
  feed: FeedAPI(socket),
  media: MediaAPI(socket),
  close: () => socket.socket.close(),
});

export type APIClient = ReturnType<typeof APIClient>;
