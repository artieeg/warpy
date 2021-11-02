import { WebSocketConn } from "./connection";
import { FeedAPI, IFeedAPI } from "./feed_api";
import { IStreamAPI, StreamAPI } from "./stream_api";
import { IMediaAPI, MediaAPI } from "./media_api";
import { INotificationAPI, NotificationAPI } from "./notifications_api";
import { IUserAPI, UserAPI } from "./user_api";
import { IGifsAPI, GifsAPI } from "./gifs_api";
import { APIObserver, IAPIObserver } from "./api_observer";
import { BotDevAPI, IBotDevAPI } from "./bot_dev_api";
import { BotAPI, IBotAPI } from "./bot_api";

interface IAPIClient {
  observer: IAPIObserver;
  user: IUserAPI;
  stream: IStreamAPI;
  feed: IFeedAPI;
  media: IMediaAPI;
  botDev: IBotDevAPI;
  bot: IBotAPI;
  notification: INotificationAPI;
  gifs: IGifsAPI;
  close: () => void;
}

export const APIClient = (socket: WebSocketConn): IAPIClient => ({
  observer: APIObserver(socket),
  bot: BotAPI(socket),
  user: UserAPI(socket),
  botDev: BotDevAPI(socket),
  stream: StreamAPI(socket),
  feed: FeedAPI(socket),
  media: MediaAPI(socket),
  close: () => socket.socket.close(),
  notification: NotificationAPI(socket),
  gifs: GifsAPI(socket),
});

export type APIClient = ReturnType<typeof APIClient>;
