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
import { CoinBalanceAPI, ICoinBalanceAPI } from "./coin_balance_api";
import { IAwardsAPI, AwardsAPI } from "./awards_api";
import { IAppInviteAPI, AppInviteAPI } from "./app_invite_api";

interface IAPIClient {
  conn: WebSocketConn;
  observer: IAPIObserver;
  awards: IAwardsAPI;
  user: IUserAPI;
  coin_balance: ICoinBalanceAPI;
  stream: IStreamAPI;
  feed: IFeedAPI;
  media: IMediaAPI;
  botDev: IBotDevAPI;
  bot: IBotAPI;
  notification: INotificationAPI;
  gifs: IGifsAPI;
  app_invite: IAppInviteAPI;
  close: () => void;
}

export const APIClient = (socket: WebSocketConn): IAPIClient => ({
  conn: socket,
  observer: APIObserver(socket),
  coin_balance: CoinBalanceAPI(socket),
  bot: BotAPI(socket),
  awards: AwardsAPI(socket),
  user: UserAPI(socket),
  botDev: BotDevAPI(socket),
  stream: StreamAPI(socket),
  feed: FeedAPI(socket),
  media: MediaAPI(socket),
  close: () => socket.socket.close(),
  notification: NotificationAPI(socket),
  gifs: GifsAPI(socket),
  app_invite: AppInviteAPI(socket),
});

export type APIClient = ReturnType<typeof APIClient>;
