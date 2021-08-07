import {IFeedResponse} from '@warpy/lib';
import {APIModule} from './types';

export interface IFeedAPI {
  get: (page: number) => Promise<IFeedResponse>;
}

export const FeedAPI: APIModule = (socket): IFeedAPI => ({
  get: (page = 0) => socket.request('request-feed', {page}),
});
