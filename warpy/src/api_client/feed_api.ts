import {APIModule} from './types';

export interface IFeedAPI {
  get: (page: number) => any;
}

export const FeedAPI: APIModule = (socket): IFeedAPI => ({
  get: (page = 0) => socket.request('request-feed', {page}),
});
