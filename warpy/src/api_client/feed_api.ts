import {APIModule} from './types';

export const FeedAPI: APIModule = socket => ({
  get: (page: number = 0) => socket.request('feed', {page}),
});
